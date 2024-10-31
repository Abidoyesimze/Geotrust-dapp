![WhatsApp Image 2024-10-31 at 9 40 24 PM](https://github.com/user-attachments/assets/ea2e5ad3-26af-47a1-9a43-a2069ef424af)

GeoTrust: A Blockchain-Based Land Ownership Platform
GeoTrust is a decentralized application (DApp) that leverages blockchain technology to streamline, secure, and verify land ownership transactions. Built with React vite, javascript, Tailwind CSS, wagmi, RainbowKit, and Solidity, GeoTrust aims to eliminate fraud, simplify the property transfer process, and improve transparency in land ownership.
Table of Contents
Project Overview
Features
Tech Stack
Architecture
Installation
Usage
Smart Contract Design
Frontend Design
Future Enhancements
Contributing
License
Project Overview
GeoTrust addresses major issues in land ownership, such as fraud, dispute resolution, and transaction transparency. By tokenizing land ownership through ERC721 NFTs, we store and validate property information on the blockchain, providing a decentralized platform for buyers, sellers, and regulatory bodies.

Goals:
Enable secure, fraud-resistant land transactions.
Facilitate transparent and permanent ownership records.
Improve accessibility for buyers, sellers, and land inspectors.
Features
Decentralized Ownership Records: Store land ownership records immutably on the blockchain.
NFT-Based Property Tokens: Each land parcel is tokenized as an NFT (ERC721 standard) to uniquely represent ownership.
Smart Contract Automation: Automates property transfer, ownership verification, and user role access.
User Dashboards: Separate dashboards for Admin Only the assigned admin can have access to this dashboard, Seller, and User to manage their specific roles and data.
Maps Integration: View properties on an interactive map to explore land locations.
Notification System: Real-time updates for property listings, status changes, and transaction completion.
Secure KYC and Access Control: Implements role-based access using OpenZeppelin’s access control for user verification.
Comprehensive Ownership History: Track previous ownership details and transaction history for each property.
Document Storage and property images with IPFS: Store property documents and property images securely on IPFS, allowing decentralized file management.
Tech Stack
Frontend: React vite, Javascript, Tailwind CSS, React, RainbowKit
Backend: Solidity, Hardhat (for local blockchain deployment)
Blockchain: Ethereum-compatible networks deployed on Lisk-sepolia
Smart Contract Libraries: OpenZeppelin, wagmi for blockchain interactions
Storage: IPFS for decentralized file storage
Testing: Jest for frontend and Hardhat/Chai for smart contract testing
Architecture
System Design Overview
The GeoTrust architecture is modular, with a clear separation between the frontend, backend (smart contracts), and decentralized storage (IPFS):

Frontend: Handles user interactions, data display, and wallet connections through RainbowKit and wagmi.
Backend (Smart Contracts):ERC721 contracts for property tokenization.
Access control contracts for managing roles and permissions.
IPFS: Secure storage of property images and documents linked to the tokenized land records.
Installation
Prerequisites
Node.js and npm
Metamask wallet for Web3 interaction
Hardhat for smart contract development and testing
Steps
Clone the repository:

git clone https://github.com/Abidoyesimze/GeoTrust.git
cd GeoTrust
Install dependencies:

npm install

Create Environment Variables:
Create a .env file and add the following environment variables:

Copy code
VITE_APPKIT_PROJECT_ID=your_rainbowkit_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
Compile Smart Contracts:

npx hardhat compile
Deploy Smart Contracts:

Start a local blockchain using Hardhat:

npx hardhat node
Deploy the contracts:

npx hardhat run scripts/deploy.js --network localhost
Run the Frontend:

npm run dev
Usage
Connect Wallet:

Users can connect their wallet through the "Connect Wallet" button on the homepage.
Property Listings:

Explore listed properties by navigating to the Explore Properties section.
Add Property:

Authorized users (e.g., sellers, admins) can add new properties and upload documents and property images.
Transaction History:

View transaction history under respective dashboards to review past ownership.
View Maps:

Access Maps to view property locations and associated information visually.
Smart Contract Design

Property Ownership (ERC721):

Each property is tokenized as a unique ERC721 token, representing ownership.
The contract stores property metadata, IPFS hash links for documents, images, and historical ownership details.
Access Control:

Uses OpenZeppelin’s AccessControl to manage roles (Admin, Users).
Roles determine what actions a user can perform within the platform.
Property Transfer:

Only verified users can initiate or finalize property transfers.
Key Contracts
GeoTrustOwnership.sol: Manages property NFTs, token minting, and ownership transfers.
GeoTrustRoles.sol: Defines roles and permissions for admin, sellers, and users.
GeoTrustKYC.sol: Manages KYC and access control for property transactions.
Frontend Design
Homepage:

Engaging interface with sections for How It Works, Key Benefits, Connect Wallet, and Explore Properties.
Dashboards:

Admin Dashboard: Manage all property listings, Verify property listed on the platform and user roles, and system-wide notifications.

User Dashboard: Explore properties, List properties, track purchase history, and access personal notifications.
Notifications:

React-Toastify is used to display real-time notifications for property updates.
Animations:

Integrates subtle animations to enhance user experience and engagement.
Future Enhancements
Integration with External Land Registries: Collaborate with local land registries for verification.
AI-Powered Fraud Detection: Use machine learning to detect fraudulent listings.
Update the Platform So a User can also build their houses on the platform talks to engineer through the platform
Multi-Language Support: Enable global accessibility by supporting multiple languages.
Mobile App: Develop a mobile version for broader access.
Advanced Analytics: Provide users with advanced analytics for property value prediction.

Fork the repository.
Create a new branch (feature/YourFeature).
Commit your changes.
Push the branch and submit a pull request.

GeoTrust reimagines land ownership management with transparency and security at its core. By leveraging blockchain, we aim to create a seamless, tamper-proof, and user-friendly platform that can reshape the future of land transactions.
