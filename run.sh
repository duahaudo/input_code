if [[ $@ ]];
    then
     if [[ "$@" == "bootstrap" ]]
      then
      hash yarn || npm install -g yarn 
      yarn install --flat --pure-lockfile
      exit 0
    fi

    if [[ "$@" == "build" ]]
      then
      rm -rf dist/ 
      ./node_modules/.bin/tsc --declaration
      exit 0
    fi

    if [[ "$@" == "deploy" ]]
      then
      ./run.sh build
      npm version patch
      exit 0
    fi
fi

printf "Please select from one of the following options.
  * bootstrap : Install package dependencies and compile SDK source.
  * build : Compile source.
  * deploy : Publish to npm.
";