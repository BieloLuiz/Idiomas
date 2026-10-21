#!/bin/sh
# Monta o app de novo a partir de fonte/ e grava o resultado na raiz do repositório (index.html, sw.js…).
# Precisa de: python3 (com Pillow: pip install pillow) e node. Rode na raiz do repositório:  sh fonte/montar.sh
set -e
python3 fonte/build.py
echo "Pronto. Confira o index.html e publique com git push na main."
