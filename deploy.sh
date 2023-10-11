IS_GREEN=$(docker ps | grep boj-bot-green) # 현재 실행중인 App이 blue인지 확인

if [ -z "$IS_GREEN"  ];then # blue라면

  echo "### BLUE => GREEN ###"

  echo "1. Get Latest Baekjoon-bot-image"
  docker-compose pull "$DOCKERHUB_USERNAME"/"$PROJECT_NAME":latest

  echo "2. green container up"
  docker-compose up -d boj-bot-green # green 컨테이너 실행

  sleep 5 #컨테이너 실행 5초 지연

  echo "3. blue container down"
  docker-compose stop boj-bot-blue

else
  echo "### GREEN => BLUE ###"

  echo "1. get blue image"
  docker-compose pull "$DOCKERHUB_USERNAME"/"$PROJECT_NAME":latest

  echo "2. blue container up"
  docker-compose up -d boj-bot-blue

  sleep 5

  echo "3. green container down"
  docker-compose stop boj-bot-green
fi