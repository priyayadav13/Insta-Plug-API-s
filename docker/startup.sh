if [ ! "$(docker network ls | grep instaplug-network)" ]; then
  echo "Creating instaplug-network network ..."
  docker network create --driver bridge instaplug-network
else
  echo "instaplug-network network exists."
fi
