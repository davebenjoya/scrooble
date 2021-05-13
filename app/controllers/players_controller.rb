class PlayersController < ApplicationController

  def create
    @player = Player.new(player_params)
  end


  def update
    # raise
    @player = Player.find(params[:id])
    @game = @player.game
    if params["challenging"] == 'false'    # string not boolean (value can be'pending')
      @player.update({challenging: 'false'})
      players = Player.where(game_id: @player.game_id)
      challenge = players.length - 1 # every player (except current player) has a chance to challenge
      players.each do |player|
        if player != @player
          challenge -= 1
        end
      end
    else                                  # challenge == 'true'
      @player.update({challenging: 'true'})
      GameChannel.broadcast_to(
        @game,
        render_to_string(partial: "challenge", locals: {msg: "someone challenged someone else"})
      )
    end
     if challenge == 0
      # return true
     end
     # raise
    # @player = Player.find(params['move']['player_id'])
    @player.save!
    render json: @player



  end


  private

  def player_params
    params.require(:player).permit(:user, :game, :player_letters, :player_score, :completed, :challenging, :id)
  end

end
