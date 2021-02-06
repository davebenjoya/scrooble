

Game.destroy_all
User.destroy_all
Player.destroy_all
deike = User.create!({ email: 'deike@benjoya.com', password: 'blue78!', username: 'Deike' })
eddie = User.create!({ email: 'ed@benjoya.com', password: 'bear16!', username: 'Ed' })
luna = User.create!({ email: 'luna@benjoya.com', password: 'moon12!', username: 'Luna' })
dave = User.create!({ email: 'dave@benjoya.com', password: 'dave63!', username: 'Dave', admin: true })
dumb = User.create!({ email: 'dumb@benjoya.com', password: 'dumb00!', username: 'Dumbledore' })
vold = User.create!({ email: 'vold@benjoya.com', password: 'vold00!', username: 'Voldemort' })
orne = User.create!({ email: 'ornette@benjoya.com', password: 'orne30!', username: 'Ornette' })
don = User.create!({ email: 'don@benjoya.com', password: 'don41!', username: 'Beefheart' })
grou = User.create!({ email: 'grou@benjoya.com', password: 'grou00!', username: 'Groucho' })
chic = User.create!({ email: 'chic@benjoya.com', password: 'chic00!', username: 'Chico' })
harp = User.create!({ email: 'harp@benjoya.com', password: 'harp00!', username: 'Harpo' })
zepp = User.create!({ email: 'zepp@benjoya.com', password: 'zepp00!', username: 'Zeppo' })



game1 = Game.create({ name: 'Friday 3AM',
              completed: false,
              current_player: 0,
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

game2 = Game.create({ name: 'Familienspiel',
              completed: true,
              current_player: 0,
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

Player.create!([{ game: game1, user: deike, player_letters: "EPIAFCZ", player_score: 38 }, { game: game1, user: eddie, player_letters: "DRUJSKO", player_score: 30 }, { game: game2, user: deike, player_letters: "EPIAFCZ", player_score: 138 }, { game: game2, user: dave, player_letters: "DRUJSKO", player_score: 150 }, { game: game2, user: luna, player_letters: "DRUJSKO", player_score: 174 } , { game: game2, user: eddie, player_letters: "DRUJSKO", player_score: 150 } ])



