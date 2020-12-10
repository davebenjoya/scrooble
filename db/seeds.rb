# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Game.destroy_all
User.destroy_all

User.create!([{ email: 'deike@benjoya.com', password: '123456', username: 'Deike' },
             { email: 'ed@benjoya.com', password: '123456', username: 'Ed' },
             { email: 'luna@benjoya.com', password: '123456', username: 'Luna' },
             { email: 'dave@benjoya.com', password: '123456', username: 'Dave' }])


# Game.create({ name: 'Friday 3AM', completed: false,
#               current_player: 2,
#               scores: [{ 'Dave': '18' }, { 'Deike': '22' },
#                       { 'Luna': '35' }, { 'Ed': '34' }],
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

Game.create({ name: 'Friday 3AM', completed: false,
              current_player: 0,
              players:  [
                         { 'name': 'Dave', 'score': '18', 'current_letters': 'RXDFOEB' },
                         { 'name': 'Deike', 'score': '22', 'current_letters': 'LTAUWVQ' },
                         { 'name': 'Luna', 'score': '35', 'current_letters': 'ZHGNIOC' },
                         { 'name': 'Ed', 'score': '34', 'current_letters': 'USYKTER' }
                        ],
              letter_grid: "_ _ _ _ _ _ B R A I N _ _ _ _
                            _ _ _ _ _ _ O _ _ D _ _ _ _ _
                            _ _ _ _ C R A S H _ _ _ _ _ _
                            _ _ _ _ O _ _ U _ _ _ _ _ _ _
                            _ _ _ _ O _ _ R _ _ _ _ _ _ _
                            _ _ G A L L O P _ _ _ _ _ _ _
                            _ _ _ _ _ _ _ R _ _ _ _ _ _ _
                            _ _ _ _ _ _ _ I _ _ _ _ _ _ _
                            _ _ _ _ _ _ _ S _ _ _ G _ _ _
                            _ _ _ _ _ _ _ E S T U A R Y _
                            _ _ _ _ _ _ _ D _ _ _ R _ _ _
                            _ _ _ _ _ _ _ _ _ _ _ L _ _ _
                            _ _ _ _ _ _ _ _ _ _ _ I _ _ _
                            _ _ _ _ _ _ _ _ _ _ _ C _ _ _
                            _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ " })

Game.create({ name: 'Regional Semifinals', completed: true,
              scores: [{ 'Dumbledore': '1860' }, { 'Voldemort': '685' }],
              letter_grid: "F R O G _ _ _ _ _ _ _ _ _ _ _
                            _ E _ _ _ _ _ _ _ _ _ _ _ _ _
                            _ M _ _ C R A S H _ _ _ _ _ _
                            _ A _ _ O _ _ _ _ _ _ _ _ _ _
                            _ I _ _ V _ _ _ _ _ _ _ _ _ _
                            _ N E V E R _ _ _ _ _ _ _ _ _
                            _ _ _ E _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ N _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ A _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ L _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ I _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ T _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ Y _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
                            _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ " })
