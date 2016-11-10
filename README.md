# automata

Run index with either the `automata` or `genetic` commands, with appropriate
options:

```
  Usage: index [options] [command]


  Commands:

    automata [options]   Simple cellular automata
    genetic [options]    Genetic cellular automata

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```
```
  Usage: automata [options]

  Simple cellular automata

  Options:

    -h, --help                       output usage information
    -s, --size <size>                Size of the automata
    -n, --neighborhood-size <nsize>  Neighborhood size
    -i, --init-state <istate>        Initial state
    -p, --rules-path <path>          Path to rule table
    -t, --num-steps <nsteps>         Time steps to run for
```
```
  Usage: genetic [options]

  Genetic cellular automata

  Options:

    -h, --help                       output usage information
    -z, --pop-size <popsize>         Initial population size
    -s, --cell-size <size>           Size of the automata
    -n, --neighborhood-size <nsize>  Neighborhood size
    -g, --gen-steps <gensteps>       Number of generations to rule for
    -a, --num-steps <nsteps>         Time steps to run automata for
```
