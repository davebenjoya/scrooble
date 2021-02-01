class PlayersController < ApplicationController



  def create
    @player = Player.new(player_params)
  end


  def update
     @player = Player.find(params[:id])

    # raise
    if @player.update(player_params)

      redirect_to edit_game_path(@player.game.id)
    else
      redirect_to edit_game_path(@player.game.id), alert: "Game not updated!"

    end


     # redirect_to edit_game_path(@game)
  end


  private

  def player_params
    params.require(:player).permit(:user, :game, :player_letters, :player_score)
  end

end
