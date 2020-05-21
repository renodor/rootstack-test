require 'json'
require 'open-uri'

# define the number of person we want to find
number_of_person = 5

# get data from randomuser API
# we used the randomuser 'inc' parameter to only fetch user names
# (because we don't need the rest of the data here, so it optimize our program)
url = "https://randomuser.me/api/?inc=name&results=#{number_of_person}"
data = JSON.parse(open(url).read)
users = data['results']

# initialize an hash that will count letters
letter_count = Hash.new(0)

# initialize a number that will save the current letter with more repetition
max = 0

# initialize a string that will be our result
result = ''

# iterate over our users
users.each do |user|
  # for each user create a full_name string that join first and last name
  full_name = "#{user['name']['first']}#{user['name']['last']}"

  # split full name in an array and iterate over it
  # (we suppose that our program must not be case sensitive, so we automatically downcase all letter)
  full_name.downcase.chars.each do |letter|
    # for each letter, increment its count in our hash
    letter_count[letter] += 1
    # for each letter, check if its count is greater than the current maximum
    if letter_count[letter] > max
      # if yes, update the current maximum and update the result
      max = letter_count[letter]
      result = letter
    end
  end
end

# print users we analized
puts users

# print result
# (By updating our result and maximum at each iteration during our loops,
# we prevent doing an aditional last loop around our hash to find the maximum)
puts result

# Aditionnal note: if different letters have the same (maximum) number of repetition,
# the result will be the first letter that reached its maximum
# (Because to update the result, a letter count must be strictly higher than the current maximum)
