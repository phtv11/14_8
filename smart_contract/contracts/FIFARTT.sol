// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FIFARTT
 * @notice Collection Right-to-Ticket (RTT) — quyền mua vé chính thức.
 *         Token trong collection này CHỈ được mint bởi contract FIFARTB (địa chỉ được
 *         cấp MINTER_ROLE khi deploy), khi holder gọi FIFARTB.redeem() để đổi RTB -> RTT.
 *
 * Vòng đời của mỗi token RTT:
 *   1. mintRTT()    -> RTT       (được gọi bởi contract RTB, không tự mint tay được)
 *   2. issueTicket()-> REDEEMED  (operator xác nhận đã phát vé thật, khóa vĩnh viễn)
 *
 * RTT là non-transferable (soulbound) — không có cơ chế transferRTT() nào cả, và
 * transfer ERC721 mặc định bị chặn hoàn toàn ở _update().
 */
contract FIFARTT is ERC721, AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    /// @dev Vai trò cấp cho contract FIFARTB để nó được phép gọi mintRTT().
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    enum Status { RTT, REDEEMED }

    struct TokenInfo {
        Status status;
        string matchId;
        uint256 fromRTBTokenId; // tokenId bên collection RTB đã bị burn để đổi lấy RTT này
        uint256 mintedAt;       // = thời điểm redeem bên RTB
        uint256 issuedAt;       // thời điểm RTT -> vé chính thức
    }

    mapping(uint256 => TokenInfo) public tokenInfo;
    uint256 public nextTokenId = 1;

    event RTTMinted(uint256 indexed tokenId, address indexed to, string matchId, uint256 indexed fromRTBTokenId);
    event TicketIssued(uint256 indexed tokenId, address indexed finalHolder, string ticketRef);

    /// @param admin Địa chỉ được cấp DEFAULT_ADMIN_ROLE / OPERATOR_ROLE (vd: ví backend FIFA).
    /// @param rtbContract Địa chỉ contract FIFARTB — nơi duy nhất được phép gọi mintRTT().
    constructor(address admin, address rtbContract) ERC721("FIFA Right-to-Ticket", "RTT-DEMO") {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
        _grantRole(MINTER_ROLE, rtbContract);
    }

    /// @notice Được gọi bởi contract FIFARTB ngay sau khi nó burn token RTB tương ứng.
    function mintRTT(address to, string calldata matchId, uint256 fromRTBTokenId)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        uint256 tokenId = nextTokenId++;
        _safeMint(to, tokenId);
        tokenInfo[tokenId] = TokenInfo({
            status: Status.RTT,
            matchId: matchId,
            fromRTBTokenId: fromRTBTokenId,
            mintedAt: block.timestamp,
            issuedAt: 0
        });
        emit RTTMinted(tokenId, to, matchId, fromRTBTokenId);
        return tokenId;
    }

    /// @notice Operator (backend FIFA) xác nhận phát hành vé thật sau khi RTT được dùng để mua vé
    ///         qua hệ thống ticketing off-chain. Sau bước này token bị khóa vĩnh viễn.
    function issueTicket(uint256 tokenId, string calldata ticketRef) external onlyRole(OPERATOR_ROLE) {
        require(tokenInfo[tokenId].status == Status.RTT, "Token khong o trang thai RTT");
        tokenInfo[tokenId].status = Status.REDEEMED;
        tokenInfo[tokenId].issuedAt = block.timestamp;
        emit TicketIssued(tokenId, ownerOf(tokenId), ticketRef);
    }

    /// @dev RTT hoàn toàn không thể chuyển nhượng (soulbound): chặn mọi transfer trực tiếp,
    ///      chỉ cho phép mint (from=0) và burn (to=0) nếu sau này cần.
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert("RTT khong the chuyen nhuong");
        }
        return super._update(to, tokenId, auth);
    }

    function getStatus(uint256 tokenId) external view returns (string memory) {
        Status s = tokenInfo[tokenId].status;
        if (s == Status.REDEEMED) return "REDEEMED";
        return "RTT";
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
