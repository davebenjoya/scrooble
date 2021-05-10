class MovesController < ApplicationController


  def index
    @moves = Move.all
  end

  def new
    raise
  end

  def show
    @move = Move.find(params[:id])
    @game = @move.player.game


    letter_string = ''
    letters = Letter.where(move_id: @move.id)
    letters.each do |ltr|
      letter_string +=  ltr.character
      letter_string += ltr.position.to_s
      letter_string += ";"
     end

     # raise

     GameChannel.broadcast_to(
      @game,
      # flash[:game_update] = "next player: #{nextP}, last player: #{@game.current_player}"
      render_to_string(partial: "submission", locals: {msg: @move.summary.strip, player: @move.player.user.username, newletters: letter_string, score: @move.added_score, moveid: @move.id})
      # render_to_string(partial: "submission", locals: {msg: ' ffdgdd g ddfghdfhrtgg  ' , player: 'mitzi', score: 12 })
    )
     # redirect_to move_path(@move)
  end

  def create
    @move = Move.new(move_params)
    @move.player = Player.find(params['move']['player_id'])
    @move.added_score = params['move']['added_score']
    @move.save!
    render json: @move
end


  def check_accept
    @move = Move.find(params[:id])
    @game = @move.player.game
    @players = Player.where(game: @game)
    challenge = @players.where(challenging: true)
    if challenge.empty?
      @move.update({provisional: false})
    end
  end

  def update
    @move = Move.find(params[:id])
    @game = @move.player.game
    @move.player.update({challenging: false})
    @players = Player.where(game: @game)
    challenge = @players.where(challenging: true)
    @move.update({ provisional: false })
    # raise
    if challenge.empty?
      # raise
      @move.update({ provisional: false })
      new_remaining = @game.remaining_letters
      move_letters = Letter.where(move_id: @move.id)
      move_letters.each do |ltr|
        new_remaining = new_remaining.sub(ltr.character, '')
      end

      new_current = @game.current_player + 1
      new_current = 0 if new_current > @players.length - 1

      @game.update({ remaining_letters: new_remaining, current_player: new_current })

     GameChannel.broadcast_to(
      @game,
      # flash[:game_update] = "next player: #{nextP}, last player: #{@game.current_player}"
      render_to_string(partial: "acceptance", locals: {msg: "word was accepted", player: @move.player.user.username, score: @move.added_score})
      # render_to_string(partial: "submission", locals: {msg: ' ffdgdd g ddfghdfhrtgg  ' , player: 'mitzi', score: 12 })
    )
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
    params.require(:move).permit(:player_id, :id, :move, :letters, :summary, :added_score, :my_score, :added_score)
  end

