if [ "$1" = "down" ]; then
    docker-compose -f docker-compose-dev.yaml down
else
    docker-compose -f docker-compose-dev.yaml down &&
    docker-compose -f docker-compose-dev.yaml build $1 &&
    docker-compose -f docker-compose-dev.yaml up -d $1 postgres
fi
