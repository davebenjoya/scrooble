class MovesController < ApplicationController


  def index
    @moves = Move.all
  end

  def new
    raise
  end

  def show
  end

  def create
    @move = Move.new(move_params)
    @move.player = Player.find(params['move']['player_id'])
    @move.save!
    render json: @move
end


  def submit_broadcast
    GameChannel.broadcast_to(
      @move,
      # flash[:game_update] = "next player: #{nextP}, last player: #{@game.current_player}"
      render_to_string(partial: "submission", locals: {player: @move.player.user.username, msg: @move.summary })


    )

    render json: @move

  end

  def updated
    @move = Move.find(params[:id])
    challenge_flag = false
    players = Player.where(game: @move.player.game)
    players.each do |plr|
      if plr.challenging == true
        challenge_flag = true
      end
    end

    if challenge_flag == false
      @move.update({provisional: false})
    end

    # render json: @move
    # if @move.update(move_params)
    #   if move.provisional == false

    #     new_score = @move.player.player_score + params['addedScore']
    #     @move.player.update(player_score: new_score)
    #   end

    #   redirect_to edit_move_path(@move.id)
    # else
    #   redirect_to edit_move_path(@move.id), alert: "Move not updated!"

    # end


     # redirect_to edit_game_path(@game)
  end



end


private


  def move_params
    params.require(:move).permit(:player_id, :move, :letters, :summary, :added_score)
  end

