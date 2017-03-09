# run the postgresql
docker run -d --name pg \
    -e POSTGRES_PASSWORD=test \
    -e POSTGRES_USER=hatu \
    -e POSTGRES_DB=hatu_test \
    -p 1024:5432 \
    postgres

# run slice data volume
docker run -d --name slicedb hjwissac/slicedb

# run the dvid
docker run -d --name dvid \
    -p 2048:8000 \
    --volumes-from slicedb \
    flyem/dvid