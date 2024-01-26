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
            buildInputs = [
              pkgs.nodejs-18_x
            ];

            src = ./.;

            # # How the output of the build phase
            installPhase = ''
              mkdir $out
              npm run build
              cp -r dist/* $out
            '';

            npmDepsHash = "sha256-WNWZis24P78M5F3QikgVKW84UQ7QOq2j7eU9S1b93g0=";

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