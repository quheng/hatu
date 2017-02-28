FROM postgres

ADD init-hatu-db.sh /docker-entrypoint-initdb.d
ADD init.sql /docker-entrypoint-initdb.d

ENTRYPOINT ["docker-entrypoint.sh"]

EXPOSE 5432
CMD ["postgres"]