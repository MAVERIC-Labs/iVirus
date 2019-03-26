#!/usr/bin/env python3

###############################################################################
#                                                                             #
#    marvel_wrapper.py                                                        #
#                                                                             #
#    A wrapper script, written for Docker, that combines several tools to     #
#    efficiently map, parse, and filter reads against a set of reference      #
#    sequences.                                                               #
#                                                                             #
#    Copyright (C) Benjamin Bolduc                                            #
#                                                                             #
###############################################################################
#                                                                             #
#    This library is free software; you can redistribute it and/or            #
#    modify it under the terms of the GNU Lesser General Public               #
#    License as published by the Free Software Foundation; either             #
#    version 3.0 of the License, or (at your option) any later version.       #
#                                                                             #
#    This library is distributed in the hope that it will be useful,          #
#    but WITHOUT ANY WARRANTY; without even the implied warranty of           #
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU        #
#    Lesser General Public License for more details.                          #
#                                                                             #
#    You should have received a copy of the GNU Lesser General Public         #
#    License along with this library.                                         #
#                                                                             #
###############################################################################

__author__ = "Ben Bolduc"
__copyright__ = "Copyright 2019"
__credits__ = ["Ben Bolduc"]
__license__ = "LGPLv3"
__maintainer__ = "Ben Bolduc"
__email__ = "bolduc.10@osu.edu"
__status__ = "Development"

import sys
import os
import argparse
import subprocess
import psutil
import shutil
import re
import tarfile

parser = argparse.ArgumentParser(description="MARVEL wrapper.")

options = parser.add_argument_group('Input and Outputs')

options.add_argument('-i', '--input-fp', dest='input_fp', metavar='FILEPATH', help="Path to input file to split, OR (if --no-split) path to directory with bins")

options.add_argument('-f', '--input-format', dest='input_format', metavar='FORMAT', default='fasta',
                     help="Input format.")

options.add_argument('--no-split', dest='no_split', action='store_true',
                     help="If enabled, will NOT SPLIT split sequences for input")

options.add_argument('-m', '--min-size', dest='min_size', metavar='INT', type=int, default=200,
                     help='Minimum sequence length size.')

options.add_argument('-o', '--output-dir', dest='output_dir', metavar='DIRPATH',
                     help="Output directory", default='MARVEL_outputs')

options.add_argument('-b', '--marvel-bin', dest='marvel_bin', metavar='FILEPATH',
                     help="Location of marvel_bins.py.", default='/MARVEL/marvel_bins.py')


results = parser.parse_args()


def error(msg):
    sys.stderr.write('ERROR: {}'.format(msg))
    sys.exit(1)

try:
    from Bio import SeqIO
except ImportError:
    error('The Biopython library is required.')


def split_sequences(input_fp, input_fmt, min_len, out_dir):
    with open(input_fp, 'r') as input_fh:
        records = [record for record in SeqIO.parse(input_fh, input_fmt) if
                   len(record.seq) >= min_len]
        print('There were {} records'.format(len(records)))

    for record in records:
        record_fn = re.sub('[^\w\-_\. ]', '_', record.id)  # Great to see so many illegal filename characters
        output_fp = os.path.join(out_dir, '{}.fasta'.format(record_fn))
        with open(output_fp, 'w') as output_fh:
            SeqIO.write([record], output_fh, 'fasta')


def runner(command, cwd):
    print('Processing {}'.format(command))
    subprocess.check_call(command, shell=True, cwd=cwd)


def run_marvel(marvel, input_dir):
    cpu_counts = psutil.cpu_count(logical=False)
    marvel_cmd = '{} -i {} -t {}'.format(marvel, input_dir, cpu_counts)

    runner(marvel_cmd, os.path.dirname(marvel))


if __name__ == "__main__":

    # Gather inputs
    input_sequences_fp = results.input_fp

    # Create output directory
    output_dir = results.output_dir
    if not os.path.isdir(output_dir):
        print('Creating directory: {}'.format(output_dir))
        os.mkdir(output_dir)

    # Split sequences (assuming that there's >1 sequence in the sequence file)
    split_dir = os.path.join(output_dir, 'split_sequences')
    if not os.path.isdir(split_dir):
        print('Creating directory: {}'.format(split_dir))
        os.mkdir(split_dir)
    print('Do not try to ls {}'.format(split_dir))

    if not results.no_split:
        split_sequences(input_sequences_fp, results.input_format, results.min_size, split_dir)
    else:  # It's a directory given as input
        for files in os.listdir(input_sequences_fp):
            shutil.copy(os.path.join(os.path.dirname(input_sequences_fp), files), split_dir)

    # Run MARVEL on split directory
    #marvel_dir = os.path.dirname(results.marvel_bin)
    #os.chdir(marvel_dir)  # Change to directory because... well, what MARVEL wants
    run_marvel(results.marvel_bin, os.path.abspath(split_dir))

    print('Cleaning up extra files and directories...')
    # Move warnings file
    shutil.move(os.path.join(split_dir, 'marvel-warnings.txt'), output_dir)
    # Move results folder outside the split directory, as we don't want people wandering into a directory
    # potentially containing 100K+ files
    results_dir = os.path.join(split_dir, 'results/')
    # Move results files
    shutil.move(results_dir, output_dir)
    # Remove split files
    shutil.rmtree(split_dir)

    print('Compressing directories with intermediate data...')
    prokka_dir = os.path.join(output_dir, 'results', 'prokka/')
    with tarfile.open(os.path.join(output_dir, 'prokka.tar.gz'), "w:gz") as tar:
        tar.add(prokka_dir, arcname=os.path.basename(prokka_dir))
    hmmscan_dir = os.path.join(output_dir, 'results', 'hmmscan/')
    with tarfile.open(os.path.join(output_dir, 'hmmscan.tar.gz'), "w:gz") as tar:
        tar.add(hmmscan_dir, arcname=os.path.basename(hmmscan_dir))

    shutil.rmtree(prokka_dir)
    shutil.rmtree(hmmscan_dir)

    print('Execution complete! Results should be in {}'.format(os.path.join(output_dir, 'results/')))

    print('If you find MARVEL useful, please site: Deyvid Amgarten, https://github.com/deyvidamgarten/MARVEL')
