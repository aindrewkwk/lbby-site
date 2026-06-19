/**
 * Lbby — English translation dictionary
 */
var LBBY_I18N_EN = {
  meta: {
    title: 'Lbby — Game Servers Made Simple',
    desc: 'Lbby is a game server hosting and management application developed by R Studio. Minecraft Java is fully supported, and Terraria is under active development.'
  },

  nav: {
    games: 'Games',
    features: 'Features',
    download: 'Download',
    docs: 'Docs',
    changelog: 'Changelog',
    license: 'License'
  },

  lang: {
    toggle: 'Switch language'
  },

  hero: {
    eyebrow: 'Lbby by R Studio',
    headline: 'Game servers made simple.',
    sub: 'Create and manage game servers without port forwarding, command lines, or router configuration. Minecraft Java is ready now, Terraria is coming soon.',
    'cta.download': 'Download Free',
    'cta.games': 'View Supported Games',
    'meta.minecraft': 'Minecraft Java',
    'meta.terraria': 'Terraria',
    'meta.nopf': 'No port forwarding',
    'meta.native': 'Native app',
    'meta.rstudio': 'By R Studio'
  },

  games: {
    label: 'Supported Games',
    title: 'What can you host?',
    minecraft: {
      title: 'Minecraft Java',
      status: 'Available now',
      desc: 'Full server management for Minecraft Java Edition with Paper, Fabric, and Forge support. Automatic modpack installation, player management, and one-click backups.',
      f1: 'Paper, Fabric & Forge support',
      f2: 'Automatic modpack installation',
      f3: 'One-click world backups',
      f4: 'Player whitelist & ban list',
      f5: 'Real-time console',
      f6: 'Automatic port forwarding via playit.gg',
      f7: 'Performance tuning presets'
    },
    terraria: {
      title: 'Terraria',
      status: 'Coming soon',
      desc: 'Terraria server hosting is under active development. Manage your world, invite friends, and configure game settings — all from a simple interface.',
      f1: 'tModLoader support planned',
      f2: 'World management',
      f3: 'Player invitations',
      f4: 'Simple configuration'
    }
  },

  showcase: {
    label: 'Showcase',
    title: 'See Lbby in action',
    desc: 'A quick look at the interface and features that make Lbby the easiest way to host game servers.',
    b1: 'Clean dashboard',
    b2: 'One-click setup',
    b3: 'Real-time console',
    b4: 'Modpack browser',
    b5: 'Player management',
    b6: 'Backup system'
  },

  features: {
    label: 'Features',
    title: 'Everything you need',
    subtitle: 'Lbby handles the hard parts so you can focus on playing.',
    f1: {
      title: 'No port forwarding',
      desc: 'Lbby uses playit.gg to tunnel your server to the internet. No router configuration, no static IP, no hassle.'
    },
    f2: {
      title: 'One-click setup',
      desc: 'Download, install, and launch a game server in under a minute. No command line knowledge required.'
    },
    f3: {
      title: 'Modpack browser',
      desc: 'Browse and install CurseForge and Modrinth modpacks directly from the app. No manual file management.'
    },
    f4: {
      title: 'Real-time console',
      desc: 'View server logs, run commands, and monitor performance — all from a live console inside the app.'
    },
    f5: {
      title: 'Automatic backups',
      desc: 'Schedule world backups or trigger them manually. Restore any backup with a single click.'
    },
    f6: {
      title: 'Player management',
      desc: 'Manage your whitelist, ban list, and operator permissions without editing server files.'
    },
    f7: {
      title: 'Performance tuning',
      desc: 'Pre-built optimization presets for view distance, simulation distance, and garbage collection. Run a smooth server on any hardware.'
    },
    f8: {
      title: 'Auto-updates',
      desc: 'Lbby and your game servers update automatically. Stay on the latest version without lifting a finger.'
    }
  },

  screenshots: {
    label: 'Screenshots',
    title: 'Take a closer look',
    s1: {
      title: 'Dashboard',
      desc: 'Your server overview at a glance — status, player count, and resource usage.'
    },
    s2: {
      title: 'Console',
      desc: 'A live console with command input, log filtering, and auto-scroll.'
    },
    s3: {
      title: 'Modpacks',
      desc: 'Browse, install, and manage modpacks from CurseForge and Modrinth.'
    }
  },

  download: {
    label: 'Download',
    title: 'Get Lbby',
    desc: 'Lbby is free to use and available for Windows. macOS and Linux builds are planned.',
    btn: 'Download for Windows',
    gh: 'View on GitHub',
    beta: 'Current release: v1.0.0-beta'
  },

  docs: {
    label: 'Documentation',
    title: 'Documentation',
    subtitle: 'Everything you need to set up and manage your game servers with Lbby.',

    nav: {
      quickstart: 'Quick Start',
      games: 'Games',
      minecraft: 'Minecraft Java',
      types: 'Server Types',
      players: 'Player Management',
      mods: 'Mods & Modpacks',
      backups: 'Backups',
      performance: 'Performance',
      playit: 'playit.gg',
      terraria: 'Terraria'
    },

    quickstart: {
      title: 'Quick Start',
      s1: 'Download Lbby from the official website or GitHub releases page.',
      s2: 'Run the installer. Lbby will set up everything automatically.',
      s3: 'Open Lbby and click "Create Server".',
      s4: 'Choose your game (Minecraft Java is available now, Terraria is coming soon).',
      s5: 'Select a server type — Paper for plugins, Fabric or Forge for mods, or Vanilla for a plain experience.',
      s6: 'Pick a name and an install directory, then click "Create".',
      s7: 'Lbby downloads the server files and generates a configuration.',
      s8: 'Click "Start" to launch your server.',
      s9: 'Lbby automatically opens a tunnel via playit.gg — no port forwarding needed.',
      s10: 'Share the playit.gg address with your friends and start playing.',
      s11: 'Use the console tab to run commands, manage players, and monitor performance.'
    },

    games: {
      title: 'Supported Games',
      mc: 'Minecraft Java Edition — fully supported with Paper, Fabric, and Forge.',
      terraria: 'Terraria — under active development. tModLoader support is planned.'
    },

    minecraft: {
      title: 'Minecraft Java Server',
      desc: 'Lbby supports multiple server types for Minecraft Java Edition. Each type offers different capabilities depending on whether you want plugins, mods, or a vanilla experience.'
    },

    types: {
      title: 'Server Types',
      intro: 'Choose the server type that best fits your needs:',
    },

    players: {
      title: 'Player Management',
      desc: 'Manage who can join your server using the built-in player management tools.',
      l1: 'Whitelist — only listed players can join.',
      l2: 'Ban list — prevent specific players from connecting.',
      l3: 'Operator list — grant admin permissions to trusted players.',
      l4: 'All changes take effect immediately without restarting the server.'
    },

    mods: {
      title: 'Mods & Modpacks',
      intro: 'Install mods and modpacks directly from Lbby without touching any files manually.',
      l1: 'Browse CurseForge and Modrinth modpacks from the app.',
      l2: 'One-click install — Lbby downloads and extracts everything for you.',
      l3: 'Switch between modpacks without losing your worlds.',
      l4: 'Update installed modpacks with a single click.'
    },

    backups: {
      title: 'Backups',
      l1: 'Create manual backups of your world at any time.',
      l2: 'Schedule automatic backups on a daily or weekly basis.',
      l3: 'Restore any backup with one click — your server restarts automatically.'
    },

    performance: {
      title: 'Performance Tuning',
      intro: 'Optimize your server for the best gameplay experience with built-in presets.',
      l1: 'View distance — control how far players can see. Lower values improve performance.',
      l2: 'Simulation distance — control how far the world simulates. Reduces CPU usage.',
      l3: 'Garbage collection tuning — optimize Java memory usage for fewer lag spikes.',
      l4: 'Apply any preset with a single click. Changes take effect after a server restart.'
    },

    playit: {
      title: 'playit.gg Integration',
      l1: 'Lbby uses playit.gg to make your server accessible over the internet.',
      l2: 'No port forwarding or static IP is required — it just works.',
      l3: 'The tunnel starts automatically when you launch your server.',
      l4: 'You can copy the playit.gg address from the dashboard to share with friends.'
    },

    terraria: {
      title: 'Terraria Server',
      desc: 'Terraria server hosting is under active development. Documentation will be available when the feature launches. tModLoader support is planned.'
    }
  },

  changelog: {
    label: 'Changelog',
    title: 'Changelog',
    all: 'View all releases on GitHub'
  },

  license: {
    label: 'License',
    title: 'License',
    desc: 'Lbby uses Ed25519-signed JWT tokens for license activation. Keys are generated and verified entirely client-side — no backend required.',
    f1: {
      title: 'Ed25519 Signing',
      desc: 'Licenses are signed with Ed25519 elliptic curve keys. The private key never leaves the generator; the public key is embedded in the app for verification.'
    },
    f2: {
      title: 'JWT Tokens',
      desc: 'Each license is a standard JSON Web Token containing user ID, tier, expiry, and optional device binding. Tokens are compact and easy to share.'
    },
    f3: {
      title: 'Novice & Master Tiers',
      desc: 'Two license tiers control feature access. Novice covers basic hosting; Master unlocks advanced tools and unlimited servers.'
    },
    f4: {
      title: 'Device Binding',
      desc: 'Licenses can optionally be bound to a device fingerprint, preventing the same key from being used on multiple machines.'
    },
    f5: {
      title: 'Expiry Control',
      desc: 'Set license validity from 30 minutes to 10 years. Tokens include a built-in expiry timestamp — the app enforces it automatically.'
    }
  },

  footer: {
    rstudio: 'A project by R Studio',
    github: 'GitHub',
    discord: 'Discord'
  }
};
