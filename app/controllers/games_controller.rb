class GamesController < ApplicationController
  def index
    @games = Game.all
  end

  def show
     @game = Game.find(params[:id])

  end

  def new
  end

  def create
    @game = Game.new(song_params)
    # authorize @game
    # @song.user = current_user
    if @game.save
      redirect_to games_path
    else
      puts "Not saved"
    end
  end

  def edit
  end

  def update
  end

  def destroy
  end
end
private

  def game_params
    params.require(:game).permit(:letter_grid)
  end
