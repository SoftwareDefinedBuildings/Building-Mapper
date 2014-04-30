#!/bin/sh
echo "Cleaning tmp directory...";
rm -rf tmp;
mkdir -p tmp/uploads;
echo "Creating database...";
python initiate.py;
echo "Done.";
