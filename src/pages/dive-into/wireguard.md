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
Address = 10.200.200.2/32, fd86:ea04:1111::2/128
PrivateKey = <content of privatekey, base64 string>
DNS = 1.1.1.1
    
[Peer]
PublicKey = <content of server publickey, base64 string>
Endpoint = <public ip of server:51820>
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
```

`Interface` is for this machine (client info here), and `Peer` is for other machine (server info here).

`10.200.200.2` and `fd86:ea04:1111::2` are private IP addresses.
I can specify any private IP addresses here,
as long as the IP addresses are matched with private subnet assigned to the server.

`/32` is a [subnet mask][CIDR], which means one single IPv4.
As a client, this machine only need one IPv4 within the virtual network.
Similarly, `/128` is a CIDR indicating one single IPv6.

[CIDR]: https://doc.m0n0.ch/quickstartpc/intro-CIDR.html

The `DNS` line is optional, which should be a DNS resolver which provides optimal resolutions for the server.
Here I use [1.1.1.1] from cloudflare.

[1.1.1.1]: https://developers.cloudflare.com/1.1.1.1/

`Endpoint` specifies how to access the server.
The IP can be IPv4 or IPv6, but typically IPv4, because the client machine may be under an IPv4-only network.
The port (`51820` here) must match the `ListenPort` specified in the interface of the server.

`0.0.0.0/0, ::/0` means sending all traffic to the server.

If the client is behind NAT, the router will need to translate its internal IP and port before forwarding the packets to the Internet.
And the router will keep tracks of the connections in a Network Address Translation table.
Based on this NAT table, it routinely closes off ports that appear dormant.
If the router erroneously closes the WireGuard port,
the WireGuard service, unaware of this change, will continue to send packets to the closed port.
This leads to network problems. 
`PersistentKeepalive = 25` means sending a keeplive packet to the server every 25 seconds to prevent the NAT expiration (typically in 60 seconds for most routers).

To enable the tunnel, run:

```sh
sudo wg-quick up /path/to/wg0.conf
```

To turn off the tunnel, run:

```sh
sudo wg-quick down /path/to/wg0.conf
```

If you uses a GUI WireGuard application, you can import the configuration file instead.

If you uses the WireGuard mobile application, the fast way to import the configuration is scan a QR code:

```sh
cat /path/to/wg0.conf | qrencode -t ansiutf8
```

Multiple servers can be specified in multiple `.conf` files.

## Server Side

Install the WireGuard package on server,
then generate key pairs as mentioned above.

Create `/etc/wireguard/wg0.conf`:

```
[Interface]
Address    = 10.200.200.1/24, fd86:ea04:1111::1/64
PrivateKey = <content of privatekey, base64 string> 
ListenPort = 51820
PostUp   = iptables -t nat -A POSTROUTING -o ens3 -j MASQUERADE; ip6tables -t nat -A POSTROUTING -o ens3 -j MASQUERADE
PostDown = iptables -t nat -D POSTROUTING -o ens3 -j MASQUERADE; ip6tables -t nat -A POSTROUTING -o ens3 -j MASQUERADE

[Peer]
PublicKey  = <content of client publickey, base64 string> 
AllowedIPs = 10.200.200.2/32, fd86:ea04:1111::2/128
```

`/24` is a subnet mask for 256 IPv4 addresses,
since an IPv4 address uses 32 bits, masking 24 bits leaves 8 bits (`2 ** 8 = 256`).
In the above example, `10.200.200.0` is preserved for compatibility reasons (IPv4 addresses ending with `.0` are historically considered representing the network itself and used for broadcasting), and `10.200.200.1` is used by the server.
Thus this virtual network allows up to 254 clients.

The subnet mask for IPv6 could be `/120` (`2 ** (128-120) = 256`).
However, IPv6 recommends using `/64` as the smallest subnet, and a lot of software assumes an IPv6 subnet will not be smaller than `/64`.

`PostUp` forwards Internet requests from clients, and `ens3` is the network interface to access Internet on the server.
`PostDown` deletes the iptable rules when the VPN is off.
Actually these are WireGuard hooks, you can fill any shell command here.

A quick explanation of iptables rules:

- `iptables`: the command line utility to configure the builtin firewall of Linux kernel.
- `-t`: stands for "table".
- `nat`: this table is consulted when a packet that creates a new connection is encountered.
- `-A`: append to the rule chain.
- `POSTROUTING`: alter packets as they are about to go out.
- `-o ens3`: alter packets that leave on `ens3` network interface (`-o` stands for "output").
- `-j`: stands for "jump", i.e., what to do if the packet matches it.
- `MASQUERADE`: MASQUERADE replaces the private IP of the packet with the public IP of the server, allowing the packet to go out to the Internet.
- `ip6tables`: iptables for IPv6.

The `PublicKey` and `AllowedIPs` in the `Peer` section should match the configuration of the client.

You can add more clients (multiple `Peer` sections).

Enable forwarding IPv4 and IPv6 packets on the server:

```sh
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
echo "net.ipv6.conf.all.forwarding = 1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

`sysctl` modifies kernel parameters at runtime, and `-p` loads `/etc/sysctl.conf`.
This is only required on the server, since client allow Internet through server.

Start WireGuard:

```sh
sudo wg-quick up wg0
# equivalent to `sudo wg-quick down /etc/wireguard/wg0.conf`
```

Stop WireGuard:

```sh
sudo wg-quick down wg0
```

You may also add WireGuard service to your init system, e.g. systemd:

```sh
sudo systemctl enable wg-quick@wg0.service
```