require 'json'
require 'open-uri'

target_age = 40

def fetch_user
  url = 'https://randomuser.me/api'
  JSON.parse(open(url).read)['results'][0]
end

def find(age)
  user_age = -1
  until user_age > age
    user = fetch_user
    user_age = user['dob']['age']
  end
  puts "Found #{user['name']['first']}! (#{user['dob']['age']} years old)."
end

find(target_age)
