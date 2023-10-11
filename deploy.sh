IS_GREEN=$(docker ps | grep boj-green-container) # 현재 실행중인 App이 blue인지 확인

if [ -z "$IS_GREEN"  ];then # blue라면

  echo "### BLUE => GREEN ###"

  echo "1. Get Latest Baekjoon-bot-image"
  sudo docker-compose pull boj-green-service

  echo "2. green container up"
  sudo docker-compose --env-file=env.list up -d boj-green-service  # green 컨테이너 실행

  sleep 5 #컨테이너 실행 5초 지연

  echo "3. blue container down"
  sudo docker-compose stop boj-blue-service

else
  echo "### GREEN => BLUE ###"

  echo "1. get blue image"
  sudo docker-compose pull boj-blue-service

  echo "2. blue container up"
  sudo docker-compose --env-file=env.list up -d boj-blue-service

  sleep 5

  echo "3. green container down"
  sudo docker-compose stop boj-green-service
fi