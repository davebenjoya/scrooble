# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Game.destroy_all
User.destroy_all

User.create!([{ email: 'deike@benjoya.com', password: 'blue78!', username: 'Deike' },
             { email: 'ed@benjoya.com', password: 'bear16!', username: 'Ed' },
             { email: 'luna@benjoya.com', password: 'moon12!', username: 'Luna' },
             { email: 'dave@benjoya.com', password: 'dave63!', username: 'Dave', admin: true },
             { email: 'dumb@benjoya.com', password: 'dumb00!', username: 'Dumbledore' },
             { email: 'vold@benjoya.com', password: 'vold00!', username: 'Voldemort' },
             { email: 'ornette@benjoya.com', password: 'orne30!', username: 'Ornette' },
             { email: 'don@benjoya.com', password: 'don41!', username: 'Beefheart' }])



# Game.create({ name: 'Friday 3AM', completed: false,
#               current_player: 0,
#               players:  [
#                          { 'name': 'Dave', 'score': '18', 'current_letters': 'RXDFOEB' },
#                          { 'name': 'Deike', 'score': '22', 'current_letters': 'LTAUWVQ' },
#                          { 'name': 'Luna', 'score': '35', 'current_letters': 'ZHGNIOC' },
#                          { 'name': 'Ed', 'score': '34', 'current_letters': 'USYKTER' }
#                          ],
#               letter_grid: "_ _ _ _ _ _ B R A I N _ _ _ _
#                             _ _ _ _ _ _ O _ _ D _ _ _ _ _
#                             _ _ _ _ C R A S H _ _ _ _ _ _
#                             _ _ _ _ O _ _ U _ _ _ _ _ _ _
#                             _ _ _ _ O _ _ R _ _ _ _ _ _ _
#                             _ _ G A L L O P _ _ _ _ _ _ _
#                             _ _ _ _ _ _ _ R _ _ _ _ _ _ _
#                             _ _ _ _ _ _ _ I _ _ _ _ _ _ _
#                             _ _ _ _ _ _ _ S _ _ _ G _ _ _
#                             _ _ _ _ _ _ _ E S T U A R Y _
#                             _ _ _ _ _ _ _ D _ _ _ R _ _ _
#                             _ _ _ _ _ _ _ _ _ _ _ L _ _ _
#                             _ _ _ _ _ _ _ _ _ _ _ I _ _ _
#                             _ _ _ _ _ _ _ _ _ _ _ C _ _ _
#                             _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ " })

# Game.create({ name: 'Kita Invitational', completed: false,
#               current_player: 0,
#               players:  [
#                          { 'name': 'Dave', 'score': '118', 'current_letters': 'RXDFOEB' },
#                          { 'name': 'Ed', 'score': '218', 'current_letters': 'USYKTER' }
#                          ],
#               letter_grid: "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ _ I _ P _ _ _ _ _ _ _ _
#                             _ _ _ _ M _ O M N I V O R E _
#                             _ _ _ _ P O O _ _ _ _ _ _ _ _
#                             _ _ _ _ R _ P _ _ _ _ _ _ _ _
#                             _ _ _ _ E _ _ _ _ _ _ _ _ _ _
#                             _ _ _ P S Y C H I C _ _ _ _ _
#                             _ _ _ _ S _ _ _ _ A _ _ _ _ _
#                             _ _ _ _ I _ _ _ _ C _ _ _ _ _
#                             _ _ B O O G E R _ A _ _ _ _ _
#                             _ _ U _ N _ _ _ _ _ _ _ _ _ _
#                             _ _ T _ A _ _ _ _ _ _ _ _ _ _
#                             _ _ T _ B _ _ _ _ _ _ _ _ _ _
#                             _ _ _ _ L _ _ _ _ _ _ _ _ _ _
#                             _ _ _ _ E _ _ _ _ _ _ _ _ _ _ " })

# Game.create({ name: 'Regional Semifinals', completed: false,
#               players: [
#                       { 'name': 'Dumbledore', 'score': '2118', 'current_letters': 'EXYAEGO' },
#                       { 'name': 'Deike', 'score': '2331', 'current_letters': 'WOTOCDK' },
#                       { 'name': 'Voldemort', 'score': '1938', 'current_letters': 'RELCOWT' },
#                       { 'name': 'Ornette', 'score': '2938', 'current_letters': 'DEELFOR' }
#                       ],
#               letter_grid: "F R O G _ _ _ _ _ _ _ _ _ _ _
#                             _ E _ _ _ _ _ _ _ _ _ _ _ _ _
#                             _ M _ _ C R A S H _ _ _ _ _ _
#                             _ A _ _ O _ _ _ _ _ _ _ _ _ _
#                             _ I _ _ V _ _ _ _ _ _ _ _ _ _
#                             _ N E V E R _ _ _ _ _ _ _ _ _
#                             _ _ _ E _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ N _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ A _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ L _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ I _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ T _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ Y _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
#                             _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ " })
