# WireGuard Quick Start

> WireGuard is an extremely simple yet fast and modern VPN that utilizes state-of-the-art cryptography.
>
> -- [www.wireguard.com](https://www.wireguard.com/)

## Client Side

Install the [WireGuard package / application][install] for your operating system.

[install]: https://www.wireguard.com/install/

Create key pairs:

```
wg genkey | tee privatekey | wg pubkey > publickey
```

Create configuration file:

```
[Interface]
Address = <private ip of virtual network>/32
PrivateKey = <content of privatekey, base64 string>
DNS = 1.1.1.1
    
[Peer]
PublicKey = <content of server publickey, base64 string>
Endpoint = <public ip of server:51820>
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

`Interface` is client info, and `Peer` is server info.

`/32` is a [subnet mask][CIDR], which means one single IP.
The client only uses one IP on the virtual network.

[CIDR]: https://doc.m0n0.ch/quickstartpc/intro-CIDR.html

The `DNS` line is optional.
But typically when you need to use a VPN,
you probably do not want to trust DNS of your ISP.

If the client is behind NAT, the router will need to translate its internal IP and port before forwarding the packets to the Internet.
And the router will keep tracks of the connectinos in a Network Address Translation table.
Based on this NAT table, it routinely closes off ports that appear dormant.
If the router erroneously closes the WireGuard port,
the WireGuard service, unaware of this change, will continue to send packets to the closed port.
This leads to network problems. 
`PersistentKeepalive = 25` means sending a keeplive packet to the server every 25 seconds to prevent the NAT expiration (typically in 60 seconds for most routers).

`0.0.0.0/0` means sending all Internet and VPN traffic to this server.

To enable the tunnel, run:

```sh
sudo wg-quick up /path/to/wg0.conf
```

If you uses a GUI WireGuard application, you can import the configuration file instead.

If you uses the WireGuard mobile application, the fast way to import the configuration is scan a QR code:

```sh
cat /path/to/wg0.conf | qrencode -t ansiutf8
```

## Server Side

Install the WireGuard package in server,
then generate key pairs as mentioned above.

Create `/etc/wireguard/wg0.conf`:

```
[Interface]
Address    = <private ip of virtual network>/24
PrivateKey = <content of privatekey, base64 string> 
ListenPort = 51820
PostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -A FORWARD -o wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -D FORWARD -o wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
 
[Peer]
PublicKey  = <content of client publickey, base64 string> 
AllowedIPs = <private ip of virtual network>/32
```

`Interface` is server info, and `Peer` is client info.
`/24` is a subnet mask, which means the virtual network allows for up to 254 clients.
`PostUp` forwards Internet requests from clients, and `eth0` is the network interface to access Internet on the server.
`PostDown` deletes the iptable rules when the VPN is off.
Actually these are WireGuard hooks, you can fill any shell command here.

On Linux, WireGuard utilizes Linux kernel to forward packets from one network interface to another, e.g. `wg0` to `eth0`,
since `wg0` itself does not have Internet access.
Thus we need to configure kernel parameters:

```sh
echo "net.ipv4.ip_forward=1" | sudo tee -a  /etc/sysctl.conf
sudo sysctl -p
```

`sysctl` modifies kernel parameters at runtime.
This is only required on the server, since client allow Internet through server.

Start WireGuard:

```sh
sudo wg-quick up /path/to/wg0.conf
```

You may also add WireGuard service to your init system, e.g. systemd:

```sh
sudo systemctl enable wg-quick@wg0.service
```

## References

- [Official Document](https://www.wireguard.com/)
- [Unofficial Document](https://docs.sweeting.me/s/wireguard#)
- [WireGuard VPN Walkthrough](https://nbsoftsolutions.com/blog/wireguard-vpn-walkthrough)