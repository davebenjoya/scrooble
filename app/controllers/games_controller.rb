

class GamesController < ApplicationController
  # skip_before_action :authenticate_user!, only: [:index, :show]

  def index
    # @games = Game.all
    @games = Game.where( "players LIKE ?", "%" + current_user.username + "%" )
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
    # authorize @game
    # @game.user = current_user
    if @game.save
      redirect_to edit_game_path(@game)
    else
      puts "Not saved"
    end
  end

  def edit
    @game = Game.find(params[:id])
    @date = @game.updated_at.strftime("%b %d, %Y %-I:%M%p")
  end

  def update
     @game = Game.find(params[:id])

    # raise

    if @game.update(game_params)
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
    params.require(:game).permit(:letter_grid, :current_player, :name, :players, :completed)
  end
