

class GamesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]

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
    @game = Game.new()
  end

  def create
    @game = Game.new(game_params)
    # authorize @game
    # @game.user = current_user
    if @game.save
      redirect_to games_path
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
     redirect_to edit_game_path(@game)
  end

  def destroy
  end
end
private

  def game_params
    params.require(:game).permit(:letter_grid, :current_player, :players, :completed)
  end
