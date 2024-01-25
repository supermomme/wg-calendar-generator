{
  description = "Sample Nix ts-node build";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
    flake-utils.url = "github:numtide/flake-utils";
    flake-utils.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, nixpkgs, ... }@inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
        {
          packages.default = pkgs.buildNpmPackage rec {
            pname = "wg-calendar-generator";
            version = "1.0.0";
            makeCacheWritable = true;
            buildInputs = [
              pkgs.nodejs-18_x
            ];

            deps = [
              pkgs.chromium
              pkgs.chromedriver
              pkgs.glib
              pkgs.nss
              pkgs.fontconfig
            ];

            src = ./.;

            # How the output of the build phase
            installPhase = ''
              mkdir $out
              npm run build
              cp -r .output $out

              mkdir $out/bin
              touch $out/bin/wg-calendar-generator
              chmod +x $out/bin/wg-calendar-generator
              cat > $out/bin/wg-calendar-generator <<EOL
              #!${pkgs.stdenv.shell}
              ${pkgs.nodejs-18_x}/bin/node $out/.output/server/index.mjs
              EOL

              echo "#!${pkgs.stdenv.shell}" >> $out/wg-calendar-generator

              ln -s ${pkgs.pkgs.chromium}/bin/chromium-browser $out/bin/chromium-browser
            '';

            npmDepsHash = "sha256-DVXV94oiNra9qHp2v3UPHH6QQ4+l/QuS0nb4d+YdCk4=";

            meta = {
              description = "A printable calendar generator for the Flatshares";
              homepage = "https://wg-calendar-generator.momme.world";
              maintainers = with pkgs.lib.maintainers; [ supermomme ];
            };
          };
          devShells.default = pkgs.mkShell {
            packages = [
              self.packages."${system}".default
            ];
          };
        }
      );
}