class PlayersController < ApplicationController



  def create
    @player = Player.new(player_params)
  end


  def update


     @player = Player.find(params[:id])
     if params["challenging"] == 'false'
      @player.update({challenging: false})
      players = Player.where(game_id: @player.game_id)
      challenge = players.length - 1 # every player (except current player) has a chance to challenge
      players.each do |player|
        if player != @player
          challenge -= 1
        end
      end
     end
     if challenge == 0
      # return true
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
