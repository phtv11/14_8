require("dotenv").config();

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deployer:", deployer.address);

    // ==========================
    // Deploy RTB
    // ==========================
    const RTB = await ethers.getContractFactory("FIFARTB");
    const rtb = await RTB.deploy();

    await rtb.deployed();

    console.log("RTB deployed to:", rtb.address);

    // ==========================
    // Deploy RTT
    // ==========================
    const RTT = await ethers.getContractFactory("FIFARTT");

    const rtt = await RTT.deploy(
        deployer.address, // admin
        rtb.address       // địa chỉ RTB
    );

    await rtt.deployed();

    console.log("RTT deployed to:", rtt.address);

    // ==========================
    // Liên kết RTB với RTT
    // ==========================
    const tx = await rtb.setRTTContract(rtt.address);
    await tx.wait();

    console.log("RTB linked to RTT");

    console.log("------------------------------");
    console.log("RTB Address :", rtb.address);
    console.log("RTT Address :", rtt.address);
    console.log("------------------------------");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });