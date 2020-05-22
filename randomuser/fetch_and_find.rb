require 'json'
require 'open-uri'

# define the target age we want to find
target_age = 50

# method that fetch one random user
# we used the randomuser 'inc' parameter to only fetch user names and age
# (because we don't need the rest of the data here so it, optimize our program)
def fetch_user
  url = 'https://randomuser.me/api?inc=name,dob'
  JSON.parse(open(url).read)['results'][0]
end

# method that find a random user with a specific age
def find_user(age)
  # initialize our user_age variable (with an impossible age)
  user_age = -1

  # create a loop that won't stop until we find an user with the correct age
  until user_age > age
    user = fetch_user
    user_age = user['dob']['age']
    # print a message if we don't find an user yet,
    # to let know that the program is still running
    puts "#{user['name']['first']} is too young... (#{user['dob']['age']} years old) Still looking..." if user_age < age
  end
  # when we find an user with the correct age, return a string with its basic infos
  "Found #{user['name']['first']}! (#{user['dob']['age']} years old)."
end

# print the target age
puts "Target age is: #{target_age}"

# call our method and print the result
puts find_user(target_age)
