import json

path = r'c:\Artly\Artly-site-2026\templates\index.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['sections']['trusted_by_logo_strip']['blocks'] = {
    'logo-alexandria': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Alexandria Real Estate Equities',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/6953a7b10a5fe7a7eca55d1e_logo.gif',
            'logo_alt_text': 'Alexandria Real Estate Equities logo',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-cisco': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Cisco',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/69498a836676fd41f6e612eb_Cisco_logo.svg',
            'logo_alt_text': 'Logo of Cisco',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-fortune': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Fortune',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/6953a7d58f783f392138f6f8_FORTUNE-LOGO-2016.webp',
            'logo_alt_text': 'Logo of Fortune, an Artly partner',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-intel': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Intel',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/69498a83421924871d87e1b7_Intel_logo_2023.svg',
            'logo_alt_text': 'Logo of Intel',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-jump-trading': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Jump Trading',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/69498a83def55b1ede133543_Jump-trading-primary-jump-trading-logo-red-and-black-full-color-rgb.svg.webp',
            'logo_alt_text': 'Logo of Jump Trading',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-mayo-clinic': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Mayo Clinic',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/69498a83e49ee88fb79a540f_Mayo_Clinic_Logo_2023.webp',
            'logo_alt_text': 'Logo of Mayo Clinic',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-mckinsey': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'McKinsey & Company',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/69498a83efb29f24bdf52b39_McKinsey_Script_Mark_2019.svg',
            'logo_alt_text': 'Logo of McKinsey & Company',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-microsoft': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Microsoft',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/694182b3507a72f097f18b00_microsoft.webp',
            'logo_alt_text': 'Logo of Microsoft',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-muji': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Muji',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/694182b3c9328da65342da90_muji.webp',
            'logo_alt_text': 'Logo of Muji',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-pure-storage': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Pure Storage',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/6953a80276940c71003c16e8_Pure-storage-vector-logo.svg.webp',
            'logo_alt_text': 'Logo of Pure Storage, an Artly partner',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-salesforce': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Salesforce',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/694182b39f0f8063084d6177_salesforce.webp',
            'logo_alt_text': 'Logo of Salesforce',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-skydio': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Skydio',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/6953a77cf3baee8c6622e710_skydio-logo-2.png',
            'logo_alt_text': 'Logo of Skydio, an Artly partner',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-tesla': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Tesla',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/694182b37bc5c6e9d01aedd3_tesla.webp',
            'logo_alt_text': 'Logo of Tesla',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-nvidia': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Nvidia',
            'external_image_url': 'https://upload.wikimedia.org/wikipedia/sco/thumb/2/21/Nvidia_logo.svg/500px-Nvidia_logo.svg.png',
            'logo_alt_text': 'Logo of Nvidia',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    },
    'logo-workday': {
        'type': 'trusted-by-logo',
        'settings': {
            'logo_name': 'Workday',
            'external_image_url': 'https://cdn.prod.website-files.com/6940345f6b3af1c307f31054/6953a76f15fd0ba50965be1c_Workday_logo.svg.webp',
            'logo_alt_text': 'Logo of Workday, an Artly partner',
            'display_height': 44,
            'open_in_new_tab': 'inherit'
        }
    }
}

data['sections']['trusted_by_logo_strip']['block_order'] = [
    'logo-alexandria',
    'logo-cisco',
    'logo-fortune',
    'logo-intel',
    'logo-jump-trading',
    'logo-mayo-clinic',
    'logo-mckinsey',
    'logo-microsoft',
    'logo-muji',
    'logo-pure-storage',
    'logo-salesforce',
    'logo-skydio',
    'logo-tesla',
    'logo-nvidia',
    'logo-workday'
]

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
    f.write('\n')

print('Updated index.json')
