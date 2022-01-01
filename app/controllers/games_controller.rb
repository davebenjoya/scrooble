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
    @players = Player.where(game: @game)

    hashed_players = []

    @players.each_with_index do | plr, ndx |
      p_score = 0
      p_moves = Move.where(player_id: plr.id)
      p_moves.each do | mv |
        p_score += mv.added_score
      end
      hashed_players << { ind: ndx, score: p_score }
    end

    sorted_players = hashed_players.sort_by { "score" }

    puts '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&'
    puts  sorted_players[0].values[0]  # index of winner in original array
    puts '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&'

    @winner = @players[sorted_players[0].values[0]].user.username
    @winner = "Tie" if sorted_players[0].values[1] == sorted_players[1].values[1]
  end

def formatted_updated_at
  updated_at.strftime("%M %D, %Y %H:%M")
end

def new

  @default_name = random_name()

  if @default_name.split(' ').length > 6
    new_name = '';
    @default_name.split(' ').each_with_index do | word, index |
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
    @game.update({remaining_letters: params['game']['remaining_letters']})
    # # authorize @game
    if @game.save
    # raise
       # @games = Game.all
       # MyGamesChannel.broadcast_to(

       #    @game,
       #    # flash[:game_update] = "next player: #{nextP}, last player: #{@game.current_player}"
       #    render_to_string(partial: "my_games", locals: {games: @games})
       #  )

    respond_to do |format|

      format.html {  }
    end




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

      @ran_array.each_with_index do |opponentId, index|
        user = User.where(id: opponentId.to_i)
        letters = params["game"]['all_player_letters'].split(',')[index]
        Player.create(user_id: opponentId.to_i, game:@game, player_letters: letters)

        if user[0] != current_user
          # UserMailer.invitation(user, current_user, @game, opponent_array).deliver
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
    game_players = Player.where(game: @game)
    @game_moves = []
    @letters = []
    @pending = false
    @player = game_players.find_by(user: current_user)
    game_players.each do |plr|
      p_moves = Move.where(player: plr)
      p_moves.each do |m|
        @game_moves << m
        ltrs = Letter.where(move: m)
        ltrs.each do |ltr|
          @letters.push(ltr)
        end
      end
      if (@game.completed == true)
        plr.update({ completed: true })
        # redirect_to game_path(@game)
      end
    end
  @player_name = current_user.username
  @submit_game_id = @game.id
  if @game_moves.length > 0
    sorted = @game_moves.sort()
    @joker_array = []
    @joker_string = ''
    sorted.each_with_index do |move, index|
      if move.joker_array.length > 0
        move.joker_array.each do |joker_position|
        @joker_array << joker_position
        @joker_string += joker_position.to_s
        @joker_string += ', ' # if index < move.joker_array.length - 1
      end
      end
    end
    @move =  sorted[sorted.length - 1]
    @player_name = @move.player.user.username
    if @move.provisional == true
      @pending = true
      letter_string = ''
      letters = Letter.where(move_id: @move.id)
      @words = Word.where(move_id: @move.id)

      letters.each do |ltr|
        letter_string += ltr.character
        letter_string += ltr.position.to_s
        letter_string += ';'
      end

      @submit_game_id = @move.player.game.id

      # GameChannel.broadcast_to(
      #   @game,
      #   render_to_string(
      #     partial: "./moves/pending",
      #     locals: {
      #       msg: "Move Pending. #{@move.summary}",
      #       player: @player_name,
      #       newletters: letter_string,
      #       score: @move.added_score,
      #       moveid: @move.id,
      #       submitgameid:@submit_game_id
      #     }))

      # render_to_string(
      #     partial: "./moves/pending",
      #     locals: {
      #       msg: "Move Pending. #{@move.summary}",
      #       player: @player_name,
      #       newletters: letter_string,
      #       score: @move.added_score,
      #       moveid: @move.id,
      #       submitgameid:@submit_game_id
      #     })


      end
    end
  end

  def update
   @game = Game.find(params[:id])
    players = Player.where(game: @game)
    @player = players.find_by(user: current_user)

    if (@game.completed == true)
      players.each do |p|
        p.update({ completed: true })
      end
    else

           # if @game.update(game_params)
      next_player = players[game_params["current_player"]]
        puts " skip #{next_player.user.username} #{next_player.skip}"
      if next_player.skip > 0
        puts "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
        puts "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||"
      end
      @game.update({
        remaining_letters: game_params["remaining_letters"],
        current_player: game_params["current_player"]
      })


      players.each do |player|
        player.update({challenging: 'pending'})
      end


      # end
     # end

    end
   # redirect_to edit_game_path(@game)
  end


  def destroy
  end

  def send_submitted
    raise
    game = Game.find params[:id]
    respond_to do |format|
      format.js
    end
  end



end

private

  def random_name

     @game = Game.new
    @users = User.all
    ghibli = Faker::JapaneseMedia::StudioGhibli.character
    lebowski = Faker::Movies::Lebowski.character
    animal = Faker::Creature::Animal.name.capitalize.split(' ')[0]
    power = Faker::Superhero.power.titlecase
    hero = Faker::Superhero.name
    prefix = Faker::Superhero.prefix
    chem = Faker::Science.element

    defaults = [ghibli, lebowski, animal, power, hero, prefix, chem]
    my_rand  = rand(defaults.length)

    if (defaults[my_rand] == "#{prefix}" || defaults[my_rand] == "#{chem}")
      return defaults[my_rand].concat(' ').concat("#{animal}")
    else
      return defaults[my_rand]
    end
  end


  def game_params
    params.require(:game).permit(:letter_grid, :game, :id, :updated_at, :current_player, :remaining_letters, :name, :completed, :jokers,
                   :opponents => [], :all_player_letters => [])
  end
