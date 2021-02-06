# require('/javascript/components/random_words.json')
require 'json'
class GamesController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @games = Game.all
  end

  def show
     @game = Game.find(params[:id])
     @date = @game.updated_at.strftime("%b %d, %Y %-I:%M%p")
  end

def formatted_updated_at
  updated_at.strftime("%M %D, %Y %H:%M ")
end

  def new

    @default_name = random_name()

    if @default_name.split(" ").length > 6
      new_name = ""
      @default_name.split(" ").each_with_index do | word, index |
        if index < 6
          new_name.concat(word).concat(" ").strip
        end
      end
      @default_name = new_name
    end

    while Game.find_by(name: @default_name)
       @default_name = random_name()
    end


  end

  def create

    @game = Game.new(game_params)
    # # authorize @game
    if @game.save
      opponent_array = []

      # first iterate to build list of all opponents' names
      params["game"]['opponents'].split(',').each do |opponentId|
        user = User.where(id: opponentId.to_i)
        opponent_array << user[0].username
      end


      # randomize order of players
      un_ran_array = params["game"]['opponents'].split(",") # make array from opponent ids
      my_id_string = ", #{current_user.id}"
      un_ran_array  << current_user.id # add this user to array
      # raise
      @ran_array = []
      while @ran_array.length < un_ran_array.length do
        myId = un_ran_array[rand(un_ran_array.length)].to_s
        @ran_array << myId unless @ran_array.include?(myId)
      end

      # then build each player object and send email
      @ran_array.each do |opponentId|
        user = User.where(id: opponentId.to_i)
        Player.create(user_id: opponentId.to_i, game:@game)
        if user[0] != current_user
          UserMailer.invitation(user, current_user, @game, opponent_array).deliver
        end
      end
    # redirect_to edit_game_path(@game)
    else
      puts "Not saved"
    # redirect_to edit_game_path(@game)
    end

  end

  def edit
    @game = Game.find(params[:id])
  end

  def update
     @game = Game.find(params[:id])
     game_players = Player.where(game: @game)
     @player = game_players.find_by(user: current_user)

    if @game.update(game_params)
      @player.update({player_score: params["game"]["my_score"] })
      @player.update({ player_letters: params["game"]["my_letters"].gsub(/\'/, "") })
     redirect_to edit_game_path(@game)
   end
  end

  def destroy
  end
end
private

  def random_name

     @game = Game.new
    @users = User.all
    ghibli = Faker::JapaneseMedia::StudioGhibli.character
    lebowski = Faker::Movies::Lebowski.character
    book = Faker::Book.title
    animal = Faker::Creature::Animal.name.capitalize
    power = Faker::Superhero.power.titlecase
    hero = Faker::Superhero.name
    prefix = Faker::Superhero.prefix.concat(" ").concat(animal)
    chem = Faker::Science.element.concat(" ").concat(animal)

    defaults = [ghibli, lebowski, book, animal, power, hero, prefix, chem]
    defaults[rand(defaults.length)]
  end


  def game_params
    params.require(:game).permit(:letter_grid, :current_player, :name,
                   :completed, :jokers, opponents:[])
  end
