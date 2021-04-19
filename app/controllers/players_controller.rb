class PlayersController < ApplicationController



  def create
    @player = Player.new(player_params)
  end


  def update


     @player = Player.find(params[:id])
     if params["challenging"] == 'false'
      @player.update({challenging: false})
     end
     # raise
    # @player = Player.find(params['move']['player_id'])
    @player.save!
    render json: @player


   #   @player = Player.find(params[:id])

   #   if params["completed"] == 'true'

   #    raise

   #   else
   #   # Move.new({score: params[:addedScore], letters: params[:letters]})
   # end
   #  # raise
   #  if @player.update(player_params)

   #    redirect_to edit_game_path(@player.game.id)
   #  else
   #    redirect_to edit_game_path(@player.game.id), alert: "Game not updated!"

   #  end

   #  render json: @player

   #   redirect_to edit_game_path(@game)
  end


  private

  def player_params
    params.require(:player).permit(:user, :game, :player_letters, :player_score, :completed, :challenging, :id)
  end

end
