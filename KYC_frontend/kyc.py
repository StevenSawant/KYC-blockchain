import requests
import json
import os

from dotenv import load_dotenv
from pathlib import Path

from web3.auto import w3

load_dotenv()

headers = {
    "Content-Type": "application/json",
    "pinata_api_key": os.getenv("PINATA_API_KEY"),
    "pinata_secret_api_key": os.getenv("PINATA_SECRET_API_KEY"),
}


def initContract():
    with open(Path("kyccontract.json")) as json_file:
        abi = json.load(json_file)

    return w3.eth.contract(address=os.getenv("KYC_ADDRESS"), abi=abi)


def convertDataToJSON(first_name, last_name, dob, email, nationality, occupation, annual_income, image):
    data = {
        "pinataOptions": {"cidVersion": 1},
        "pinataContent": {
            "name": "KYC Report",
            "first_name": first_name,
            "last_name":  last_name,
            "date of birth": dob,
            "email": email,
            "nationality": nationality, 
            "occupation": occupation,
            "annual_income": annual_income,
            "image": image,
        },  
    }
    return json.dumps(data)


def pinJSONtoIPFS(json_data):
    r = requests.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS", data=json_data, headers=headers
    )
    ipfs_hash = r.json()["IpfsHash"]
    return f"ipfs://{ipfs_hash}"

def pinFileToIPFS(file_path):
    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    file_headers = {
        "pinata_api_key": os.getenv("PINATA_API_KEY"),
        "pinata_secret_api_key": os.getenv("PINATA_SECRET_API_KEY"),
    }
    with open(file_path, 'rb') as fp:
        files = {'file': (os.path.basename(file_path), fp)}
        response = requests.post(url, files=files, headers=file_headers)
    ipfs_hash = response.json().get("IpfsHash", "")
    return f"ipfs://{ipfs_hash}" if ipfs_hash else "none"
