# require('/javascript/components/random_words.json')
require 'json'
class GamesController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    @games = Game.all
    # @games = Game.where( "players LIKE ?", "%" + current_user.username + "%" )
  end

  def show
     @game = Game.find(params[:id])
     @date = @game.updated_at.strftime("%b %d, %Y %-I:%M%p")
  end

def formatted_updated_at
  updated_at.strftime("%M %D, %Y %H:%M ")
end

  def new
    @game = Game.new
    @users = User.all
  end

  def create

    @game = Game.new(game_params)
    # raise
    # @opponent = Player.new({user: params.opponents, game: @game})
    # # authorize @game
    if @game.save
      Player.create({ user_id: current_user.id, game: @game })
      opponent_array = []
      # first iterate to build list of all opponents' names
      params['game']['opponents'].split(',').each do |opponentId|
        user = User.where(id: opponentId.to_i)
        opponent_array << user[0].username
      end
      # then build each player object and send email
      params['game']['opponents'].split(',').each do |opponentId|
        user = User.where(id: opponentId.to_i)
        Player.create(user_id: opponentId.to_i, game:@game)
        adverb = "emphatically"
        UserMailer.invitation(user, current_user, @game, opponent_array, adverb.capitalize()).deliver
      end
    # raise
    redirect_to edit_game_path(@game)
    else
      puts "Not saved"
    redirect_to edit_game_path(@game)
    end

  end

  def edit
    @game = Game.find(params[:id])
  end

  def update
     @game = Game.find(params[:id])
     game_players = Player.where(game: @game)
     @player = game_players.find_by(user: current_user)

    # raise

    if @game.update(game_params)
    #   GameChannel.broadcast_to(
    #   @game,
    #   render_to_string(partial: "message", locals: { message: @game.players })
    # )
      GameChannel.broadcast_to(
      @game,
      render_to_string(partial: "message", locals: { message: @game.players })
    )
      redirect_to edit_game_path(@game)
    else
      redirect_to edit_game_path(@game), alert: "Game not updated!"

    end


     # redirect_to edit_game_path(@game)
  end

  def destroy
  end
end
private

  def game_params
    params.require(:game).permit(:letter_grid, :current_player, :name,
      :completed, :jokers, opponents:[])
  end
