require 'json'
require 'open-uri'

# define the number of person we want to find
number_of_person = 10

# get data from randomuser API
# we used the randomuser 'inc' parameter to only fetch user names
# (because we don't need the rest of the data here, so it optimize our program)
url = "https://randomuser.me/api/?inc=name&results=#{number_of_person}"
data = JSON.parse(open(url).read)
users = data['results']

# iterate over all users we got and put their first names in an array
first_names = users.map do |user|
  user['name']['first']
end

# sort the first names array in alphabetical order and print the result
puts first_names.sort
