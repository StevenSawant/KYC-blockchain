# How to Run the KYC-Blockchain Project

This document provides a step-by-step guide on how to set up and run the KYC-Blockchain project from scratch.

## 1. Prerequisites
Ensure you have the following installed on your system:
*   [Node.js](https://nodejs.org/) (for running the React frontend)
*   [Python 3](https://www.python.org/downloads/) (for the backend CLI)
*   [Ganache](https://trufflesuite.com/ganache/) (for running a local Ethereum blockchain)
*   [MetaMask](https://metamask.io/) Extension in your browser (connected to your Ganache network)
*   A [Pinata Cloud](https://www.pinata.cloud/) account to get API keys for IPFS storage.

---

## 2. Smart Contract Deployment (Blockchain)
First, you need to deploy the smart contract to your local Ganache network.

1.  Open **Ganache** and start a new workspace.
2.  Open your browser and navigate to [Remix IDE](https://remix.ethereum.org/).
3.  In Remix, create a new file named `kyccontract.sol` and paste the contents of the `kyccontract.sol` file from this project.
4.  Go to the **Solidity Compiler** tab and click **Compile kyccontract.sol**.
5.  Go to the **Deploy & Run Transactions** tab and select your Environment.
    *   **Option A:** Set the **Environment** dropdown to **Injected Provider - MetaMask**. Make sure MetaMask is connected to your local Ganache network (`http://127.0.0.1:7545`).
    *   **Option B (If MetaMask fails to be identify the Ganache Wallet):** Set the Environment to **Custom - External Http Provider** (or **Dev - Ganache Provider**). Enter the default Ganache link: `http://127.0.0.1:7545`. This connects Remix directly to Ganache without needing MetaMask!
    *   Click **Deploy**.
6.  Once deployed, copy the **Contract Address** from the "Deployed Contracts" section in Remix.
7.  Go back to the **Solidity Compiler** tab and copy the **ABI** (Application Binary Interface) of the contract.

---

## 3. Python Backend Setup & Execution (The Core Logic)
This part of the project handles the actual interaction with the blockchain and IPFS.

1.  Open a terminal and navigate to the `KYC_frontend` folder:
    ```bash
    cd KYC_frontend
    ```
2.  Install the required Python libraries (if not already installed):
    ```bash
    pip install web3 python-dotenv requests flask flask-cors
    ```
3.  **Configure Environment Variables**:
    *   Make sure the `.env` file in the `KYC_frontend` folder has your Pinata keys and the new Contract Address:
        ```text
        PINATA_API_KEY=your_actual_api_key_here
        PINATA_SECRET_API_KEY=your_actual_secret_key_here
        KYC_ADDRESS=your_deployed_contract_address_here
        WEB3_PROVIDER_URI=http://127.0.0.1:7545
        ```
4.  **Update the ABI**:
    *   Open `KYC_frontend/kyccontract.json` and paste the ABI you copied from Remix in step 2.
5.  **Run the Backend Server**:
    Instead of using the manual CLI, start the automated API server so the frontend can talk to it:
    ```bash
    python app.py
    ```
    *   This will start a Flask server running on `http://127.0.0.1:5000`. Keep this terminal window open.

---

## 4. React Frontend Setup & Execution (The Web UI)
This part is the visual interface that users will interact with.

1.  Open a new, separate terminal and navigate to the `form-react` folder:
    ```bash
    cd form-react
    ```
2.  Install the Node project dependencies (only needed the first time):
    ```bash
    npm install --legacy-peer-deps
    ```
3.  Start the React application:
    ```bash
    npm start
    ```
4.  Your browser should automatically open `http://localhost:3000`. 
5.  Fill out the form. 
    *   *Note: Ensure the address you enter matches a funded Ganache address for the User ID/App Address.*
6.  Click **Submit**. The frontend will now securely send the data to the Python backend, process it on the blockchain, and pop up an alert with your final transaction details!

---

## 5. Stopping the Project
When you are done testing the application, follow these steps to stop all running services:

1. **Stop the React Frontend**: Go to the terminal where `npm start` is running. Press `Ctrl + C` to terminate the process. If it asks "Terminate batch job (Y/N)?", type `Y` and press `Enter`.
2. **Stop the Python Backend**: Go to the terminal where `python app.py` is running and press `Ctrl + C`.
3. **Stop Ganache**: Simply close the Ganache desktop application.

---

## 6. Restarting the Project
If you have stopped the project entirely and want to run it again, follow these quick steps:

1. **Open Ganache**: Start the Ganache desktop application.
    * *Important for New Workspaces:* If you start a brand **new workspace**, your previous block data is wiped! This means your old smart contract is gone. You must completely repeat **Step 2 (Smart Contract Deployment)** to deploy your `kyccontract.sol` in Remix again and paste your *newly generated* `KYC_ADDRESS` into your `KYC_frontend/.env` file. You must also re-import an account with 100 test ETH into MetaMask.
    * *Saved Workspaces:* If you load a **Saved Workspace** in Ganache, your contract is still there! You can skip Step 2.
2. **Start the Python Backend**: Open a terminal, navigate to the backend folder (`cd KYC_frontend`), and run:
    ```bash
    python app.py
    ```
3. **Start the React Frontend**: Open a second terminal window, navigate to the frontend folder (`cd form-react`), and run:
    ```bash
    npm start
    ```
4. **Final Check**: Ensure MetaMask is unlocked, and your active network at the top left says **Ganache Local** (or whatever you named the custom 127.0.0.1:7545 network). You are now ready to fill out the form and hit **Submit** again!


