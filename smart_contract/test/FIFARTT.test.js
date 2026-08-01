const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("FIFARTT Rules", function () {


    let rtb;
    let rtt;

    let admin;
    let backend;
    let user;
    let other;



    beforeEach(async function () {


        [
            admin,
            backend,
            user,
            other
        ] =
        await ethers.getSigners();



        const RTB =
            await ethers.getContractFactory(
                "FIFARTB"
            );


        rtb =
            await RTB.deploy();


        await rtb.waitForDeployment();



        const RTT =
            await ethers.getContractFactory(
                "FIFARTT"
            );


        rtt =
            await RTT.deploy(
                admin.address,
                await rtb.getAddress()
            );


        await rtt.waitForDeployment();



        await rtb.setRTTContract(
            await rtt.getAddress()
        );



        await rtb.grantRole(
            await rtb.OPERATOR_ROLE(),
            backend.address
        );



        await rtb
        .connect(backend)
        .mintRTB(
            user.address,
            "MATCH"
        );



        await rtb
        .connect(user)
        .redeem(1);



        await rtt.grantRole(
            await rtt.OPERATOR_ROLE(),
            backend.address
        );


    });



    it("Ví thường gọi mintRTT phải revert",
    async function () {


        await expect(

            rtt
            .connect(user)
            .mintRTT(
                user.address,
                "MATCH",
                99
            )

        )
        .to.be.reverted;


    });



    it("RTT.transferFrom phải revert vì soulbound",
    async function () {


        await expect(

            rtt
            .connect(user)
            .transferFrom(
                user.address,
                other.address,
                1
            )

        )
        .to.be.revertedWith(
            "RTT khong the chuyen nhuong"
        );


    });



    it("issueTicket 2 lần cùng token lần 2 phải revert",
    async function () {


        await rtt
        .connect(backend)
        .issueTicket(
            1,
            "TICKET-WC26-001"
        );



        expect(
            await rtt.getStatus(1)
        )
        .to.equal(
            "REDEEMED"
        );



        await expect(

            rtt
            .connect(backend)
            .issueTicket(
                1,
                "TICKET-WC26-001"
            )

        )
        .to.be.revertedWith(
            "Token khong o trang thai RTT"
        );


    });


});