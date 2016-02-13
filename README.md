# CRN Polyglot
A unified interface for generating files for various Chemical Reaction 
Network (CRN) tools

## Problem
Several CRN tools exist that generate different reports given a set of 
chemical reactions. However, these tools also have different file formats 
and interfaces for entering the reactions. One must therefore manually re-enter 
the reactions for each tool if they wish to see all reports, which is not only 
tedious but also error-prone.

## Solution
CRN Polyglot provides a unified interface for the different tools, only 
requiring users to enter the reactions once. Ideally, CRN Polyglot would 
automatically connect to all the tools and generate their respective reports. 
Unfortunately, this is quite a difficult task due to the tools' lack of an 
interface accessible by computer programs, and so CRN polyglot instead 
simply generates the files accepted by the tools. Users will then open these 
files in their respective tools, but will no longer need to enter the reactions 
multiple times.

## Tools
| Tool       | Website                                                |
| ---------- |:------------------------------------------------------ |
| CoNtRol    | https://reaction-networks.net/control/                 |
|            | https://reaction-networks.net/wiki/CoNtRol             |
| ERNEST     | http://people.sissa.it/~altafini/papers/SoAl09/        |
| CRNToolbox | https://crnt.osu.edu/chemical-reaction-network-toolbox |
| CRNreals   | http://gingproc.iim.csic.es/~gingproc/CRNreals/        |

## Project Members
- Adrian Perez
- Matthew Allen Go
- Shayane Tan
