import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from kycreport import createkycReport, kycreport, kycupdate
from kyc import pinFileToIPFS

app = Flask(__name__)
CORS(app)  # Enable CORS for the React frontend

@app.route('/api/register', methods=['POST'])
def register_kyc():
    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.form
        else:
            data = request.json or {}
            
        print("Received data:", data)
        
        # Extract fields from the request
        first_name = data.get('fName')
        last_name = data.get('lName')
        dob = data.get('bdate')
        email = data.get('email')
        nationality = data.get('nationality', 'N/A')
        occupation = data.get('occupation', 'N/A')
        annual_income = data.get('annualIncome', '0')
        user_id = data.get('appAddress')
        
        image = "none"
        if 'imageFile' in request.files:
            file = request.files['imageFile']
            if file and file.filename != '':
                temp_dir = tempfile.gettempdir()
                filename = secure_filename(file.filename)
                file_path = os.path.join(temp_dir, filename)
                file.save(file_path)
                image = pinFileToIPFS(file_path)
                os.remove(file_path)
        
        # 1. Create the KYC Report (pins to IPFS)
        uid, report_uri = createkycReport(
            first_name, last_name, dob, email, nationality, occupation, annual_income, user_id, image
        )
        
        # 2. Register on the Blockchain
        receipt = kycreport(uid, report_uri)
        
        # Check if the transaction reverted (e.g. duplicate registration)
        if receipt.get('status') == 0:
            return jsonify({
                'success': False,
                'message': 'Account already exists for this wallet address. Duplicate registration is not allowed.'
            }), 400
        
        # Convert hexbytes to string for JSON serialization
        tx_hash = receipt['transactionHash'].hex()
        
        return jsonify({
            'success': True,
            'message': 'KYC successfully registered on the blockchain!',
            'transactionHash': tx_hash,
            'ipfsHash': report_uri
        }), 200

    except Exception as e:
        print("Error during registration:", str(e))
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/api/update', methods=['POST'])
def update_kyc():
    try:
        if request.content_type and request.content_type.startswith('multipart/form-data'):
            data = request.form
        else:
            data = request.json or {}

        print("Update data received:", data)

        first_name = data.get('fName')
        last_name = data.get('lName')
        dob = data.get('bdate')
        email = data.get('email')
        nationality = data.get('nationality', 'N/A')
        occupation = data.get('occupation', 'N/A')
        annual_income = data.get('annualIncome', '0')
        user_id = data.get('appAddress')

        # --- Pre-check: verify the wallet is already registered ---
        from kycreport import kyccontract
        client_data = kyccontract.functions.Clientdatabase(user_id).call()
        # client_data = (userID, report_uri, used, end_date)
        if not client_data[2]:  # 'used' field is False → not registered
            return jsonify({
                'success': False,
                'message': 'This wallet address is not registered. Please register first before updating.'
            }), 400

        image = "none"
        if 'imageFile' in request.files:
            file = request.files['imageFile']
            if file and file.filename != '':
                temp_dir = tempfile.gettempdir()
                filename = secure_filename(file.filename)
                file_path = os.path.join(temp_dir, filename)
                file.save(file_path)
                image = pinFileToIPFS(file_path)
                os.remove(file_path)

        # 1. Create new KYC report and pin to IPFS
        uid, report_uri = createkycReport(
            first_name, last_name, dob, email, nationality, occupation, annual_income, user_id, image
        )

        # 2. Update on the Blockchain
        receipt = kycupdate(uid, report_uri)

        # If the transaction reverted for any other reason
        if receipt.get('status') == 0:
            return jsonify({
                'success': False,
                'message': 'Update failed. This wallet address may not be registered yet.'
            }), 400

        tx_hash = receipt['transactionHash'].hex()

        return jsonify({
            'success': True,
            'message': 'KYC successfully updated on the blockchain!',
            'transactionHash': tx_hash,
            'ipfsHash': report_uri
        }), 200

    except Exception as e:
        print("Error during update:", str(e))
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500


@app.route('/api/checkvalidity', methods=['GET'])
def check_validity():
    try:
        from kycreport import kyccontract
        user_id = request.args.get('address')
        if not user_id:
            return jsonify({'success': False, 'message': 'No wallet address provided.'}), 400

        # Check if registered first
        client_data = kyccontract.functions.Clientdatabase(user_id).call()
        if not client_data[2]:
            return jsonify({
                'success': True,
                'status': 'not_registered',
                'message': 'This wallet address is not registered in the KYC system.'
            }), 200

        # Call the checkvalidity function on the smart contract
        result = kyccontract.functions.checkvalidity(user_id).call()
        is_valid = "Valid" in result

        return jsonify({
            'success': True,
            'status': 'valid' if is_valid else 'expired',
            'message': result
        }), 200

    except Exception as e:
        print("Error during validity check:", str(e))
        return jsonify({'success': False, 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
