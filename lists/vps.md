# Virtual Private Servers List

Boring fact: Among all regions of AWS EC2, Cape Town, Mumbai, Hong Kong, and Singapore are the only four not governed by a country that belongs to [NATO], [PfP], or [MNNA].

[NATO]: https://en.wikipedia.org/wiki/NATO
[PfP]: https://en.wikipedia.org/wiki/Partnership_for_Peace
[MNNA]: https://en.wikipedia.org/wiki/Major_non-NATO_ally

```json
[
    {
        "provider": "BuyVM",
        "url": "https://buyvm.net/kvm-dedicated-server-slices/",
        "ram": 512,
        "disk": 10,
        "bandwidth": "unmetered",
        "ipv4": 1,
        "monthly": "$2",
        "regions": [
            "us",
            "lu"
        ]
    },
    {
        "provider": "TinyKVM",
        "url": "https://tinykvm.com",
        "ram": 256,
        "disk": 7,
        "bandwidth": 200,
        "yearly": "$15",
        "regions": [
            "us"
        ]
    },
    {
        "provider": "AnyNode",
        "url": "https://anynode.net/vps-kvm-ssd.php",
        "ram": 256,
        "disk": 10,
        "bandwidth": 500,
        "yearly": "$15",
        "regions": [
            "us"
        ]
    },
    {
        "provider": "AnyNode",
        "url": "https://anynode.net/vps-kvm-ssd.php",
        "ram": 512,
        "disk": 15,
        "bandwidth": 500,
        "monthly": "$2.5",
        "regions": [
            "us"
        ]
    },
    {
        "provider": "Somagu",
        "url": "https://www.somagu.com",
        "ram": 512,
        "disk": 20,
        "ipv4": 0,
        "bandwidth": "90 KRW per 1 GiB, inbound & outbound",
        "monthly": "$0.65",
        "regions": [
            "kr"
        ]
    },
    {
        "provider": "iwStack",
        "url": "https://iwstack.com",
        "ram": 512,
        "disk": "€0.0001 per GB per hour",
        "ipv4": 1,
        "bandwidth": 2000,
        "hourly": "€0.003",
        "regions": [
            "it",
            "nl",
            "ro"
        ]
    },
    {
        "provider": "CloudCone",
        "url": "https://cloudcone.com/cloud-servers/",
        "ram": 1024,
        "disk": 20,
        "ipv4": 1,
        "hourly": "$0.00498",
        "regions": [
            "us"
        ],
        "note": "Even when you have uploaded ssh key in panel, you have to run command manually to download ssh key on the vps! (Initial login need use password.) Also its REST API uses GET method for reboot/shutdown/create/destroy."
    },
    {
        "provider": "Scaleway",
        "url": "https: //www.scaleway.com/en/pricing/#virtual-instances",
        "ram": 1024,
        "disk": 10,
        "ipv4": 1,
        "bandwidth": "100 Mbit/s",
        "hourly": "€0.0025",
        "regions": [
            "fr",
            "nl",
            "pl"
        ]
    },
    {
        "provider": "vultr",
        "url": "https://www.vultr.com/products/cloud-compute/#pricing",
        "ram": 512,
        "disk": 10,
        "ipv4": 1,
        "bandwidth": 500,
        "hourly": "$0.005"
    },
    {
        "provider": "vultr",
        "url": "https://www.vultr.com/products/cloud-compute/#pricing",
        "ram": 512,
        "disk": 10,
        "ipv4": 0,
        "bandwidth": 500,
        "hourly": "$0.004"
    },
    {
        "provider": "vultr",
        "url": "https://www.vultr.com/products/cloud-compute/#pricing",
        "ram": 1024,
        "disk": 25,
        "ipv4": 1,
        "bandwidth": 1000,
        "hourly": "$0.007",
        "regions": [
            "au",
            "ca",
            "de",
            "fr",
            "jp",
            "kr",
            "nl",
            "sg",
            "uk",
            "us"
        ]
    },
    {
        "provider": "LunaNode",
        "url": "https://www.lunanode.com/pricing",
        "ram": 512,
        "disk": 15,
        "bandwidth": 1000,
        "hourly": "$0.00625",
        "regions": [
            "ca",
            "fr"
        ]
    },
    {
        "provider": "DigitalOcean",
        "url": "https://www.digitalocean.com/pricing",
        "ram": 1024,
        "disk": 25,
        "bandwidth": 1000,
        "hourly": "$0.007",
        "regions": [
            "ca",
            "de",
            "in",
            "nl",
            "sg",
            "uk",
            "us"
        ]
    },
    {
        "provider": "Linode",
        "url": "https://www.digitalocean.com/pricing",
        "ram": 1024,
        "disk": 25,
        "bandwidth": 1000,
        "hourly": "$0.0075",
        "regions": [
            "au",
            "ca",
            "de",
            "in",
            "jp",
            "sg",
            "uk",
            "us"
        ]
    },
    {
        "provider": "Memset",
        "url": "https://www.memset.com/services/cloud-iaas/pricing/",
        "ram": 1024,
        "hourly": "£0.0155",
        "regions": ["uk"]
    },
    {
        "provider": "Atlantic",
        "url": "https://www.atlantic.net/vps-hosting/pricing/",
        "ram": 2048,
        "disk": 50,
        "bandwidth": 3000,
        "hourly": "$0.0149",
        "regions": ["ca", "uk", "us"]
    },
    {
        "provider": "ExoScale",
        "url": "https://www.exoscale.com/pricing/",
        "ram": 512,
        "disk": 10,
        "hourly": "$0.00694",
        "regions": ["at", "bg", "ch", "de"]
    },
    {
        "provider": "ConoHa",
        "url": "https://www.conoha.jp/vps/pricing/",
        "ram": 512,
        "disk": 30,
        "hourly": "1.0円",
        "regions": ["jp", "sg"]
    },
    {
        "provider": "AWS EC2 Nano",
        "url": "https://aws.amazon.com/ec2/pricing/on-demand/",
        "ram": 512,
        "hourly": "$0.0042",
        "regions": ["au", "bh", "br", "ca", "de", "fr", "hk", "ie", "in", "it", "jp", "kr", "se", "sg", "uk", "us", "za"]
    }
]
```