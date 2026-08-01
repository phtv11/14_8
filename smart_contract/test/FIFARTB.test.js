const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("FIFARTB Lifecycle", function () {

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
        ] = await ethers.getSigners();


        // Deploy RTB

        const RTB =
            await ethers.getContractFactory(
                "FIFARTB"
            );


        rtb =
            await RTB.deploy();


        await rtb.waitForDeployment();



        // Deploy RTT

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



        // Link RTT

        await rtb.setRTTContract(
            await rtt.getAddress()
        );


        // cấp quyền mint RTB cho backend

        await rtb.grantRole(
            await rtb.OPERATOR_ROLE(),
            backend.address
        );


    });



    it("mint RTB -> owner đúng, matchId đúng",
    async function () {


        await rtb
        .connect(backend)
        .mintRTB(
            user.address,
            "WC26-FINAL"
        );


        expect(
            await rtb.ownerOf(1)
        )
        .to.equal(
            user.address
        );


        const info =
            await rtb.tokenInfo(1);


        expect(info.matchId)
        .to.equal(
            "WC26-FINAL"
        );

    });



    it("transferFrom trực tiếp phải revert",
    async function () {


        await rtb
        .connect(backend)
        .mintRTB(
            user.address,
            "WC26-FINAL"
        );


        await expect(

            rtb
            .connect(user)
            .transferFrom(
                user.address,
                other.address,
                1
            )

        )
        .to.be.revertedWith(
            "Dung transferRTB() thay vi transfer mac dinh"
        );

    });



    it("transferRTB thành công",
    async function () {


        await rtb
        .connect(backend)
        .mintRTB(
            user.address,
            "MATCH-001"
        );


        await rtb
        .connect(user)
        .transferRTB(
            other.address,
            1
        );


        expect(
            await rtb.ownerOf(1)
        )
        .to.equal(
            other.address
        );

    });



    it("redeem -> burn RTB và mint RTT",
    async function () {


        await rtb
        .connect(backend)
        .mintRTB(
            user.address,
            "FINAL"
        );



        await rtb
        .connect(user)
        .redeem(1);



        await expect(
            rtb.ownerOf(1)
        )
        .to.be.reverted;



        expect(
            await rtt.ownerOf(1)
        )
        .to.equal(
            user.address
        );



        const info =
            await rtt.tokenInfo(1);


        expect(info.matchId)
        .to.equal(
            "FINAL"
        );


        expect(info.fromRTBTokenId)
        .to.equal(1);

    });



    it("người không phải chủ gọi redeem phải revert",
    async function () {


        await rtb
        .connect(backend)
        .mintRTB(
            user.address,
            "MATCH"
        );


        await expect(

            rtb
            .connect(other)
            .redeem(1)

        )
        .to.be.revertedWith(
            "Khong phai chu so huu"
        );


    });


});