# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-24.05"; # or "unstable"
  
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
    pkgs.rustup
    pkgs.gcc
    pkgs.pkg-config
    # Tauri specific dependencies
    pkgs.gtk3
    pkgs.glib
    pkgs.gdk-pixbuf
    pkgs.cairo
    pkgs.pango
    pkgs.atk
    pkgs.at-spi2-atk
    pkgs.harfbuzz
    pkgs.at-spi2-core
    pkgs.libsoup
    pkgs.webkitgtk
    pkgs.librsvg
    pkgs.openssl
    pkgs.dbus
    pkgs.zlib
  ];
  
  # Sets environment variables in the workspace
  env = {
    API_KEY = "AIzaSyBXiUySlHkTEtlOup3h290SNb9ykoDiC3w";
    VITE_API_KEY = "AIzaSyBXiUySlHkTEtlOup3h290SNb9ykoDiC3w";
    
    # [중요] zlib 링커 에러 방지용 (기존 유지)
    LIBRARY_PATH = "${pkgs.zlib}/lib";
    
    # ▼▼▼ [핵심 수정] pkg-config가 라이브러리를 찾을 수 있게 경로를 지정합니다. ▼▼▼
    PKG_CONFIG_PATH = pkgs.lib.makeSearchPathOutput "dev" "lib/pkgconfig" [
      pkgs.glib
      pkgs.gtk3
      pkgs.libsoup
      pkgs.webkitgtk
      pkgs.librsvg
      pkgs.openssl
      pkgs.zlib
      pkgs.pango
      pkgs.harfbuzz
      pkgs.cairo
      pkgs.gdk-pixbuf
      pkgs.atk
      pkgs.dbus
      pkgs.at-spi2-atk
    ];
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "google.gemini-cli-vscode-ide-companion"
      "rust-lang.rust-analyzer"
      "tamasfe.even-better-toml"
    ];
    workspace = {
      # Runs when a workspace is first created with this `dev.nix` file
      onCreate = {
        npm-install = "npm i --no-audit --no-progress --timing";
        tauri-cli-install = "npm install -D @tauri-apps/cli";
      };
      # To run something each time the workspace is (re)started, use the `onStart` hook
      onStart = {
        # The following script will run the backend server on port 3001
        run-server = "npm run server";
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          # The following command will run the frontend development server
          command = ["npm" "run" "dev:frontend" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}