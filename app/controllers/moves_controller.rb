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
    words = Word.where(move_id: @move.id)
    puts "-------------------------------______________________"
    letters.each do |ltr|
      letter_string +=  ltr.character
      letter_string += ltr.position.to_s
      letter_string += ";"
     end

      players = Player.where(game: @game)
      current = players[@game.current_player]


     GameChannel.broadcast_to(
      @game,
      render_to_string(
        partial: "submission",
        locals: {
          msg: @move.summary,
          player: @move.player.user.username,
          newletters: letter_string,
          score: @move.added_score,
          moveid: @move.id,
          gameid: @game.id
        }
        )
      )
  end

  def create
    @move = Move.new(move_params)
    @move.player = Player.find(params['move']['player_id'])
    @move.added_score = params['move']['added_score']
    @move.summary = params['move']['summary']
    @move.save!
    render json: @move
end


  def check_accept
    @move = Move.find(params[:id])
    @game = @move.player.game
    @players = Player.where(game: @game)
    challenge = @players.where(challenging: 'pending')
    if challenge.empty?
      @move.update({provisional: false})
    end
  end

  def update
    puts '-----------------------------------------------------'
    puts '--------------- UPDATE PARAMETERS -------------------'
    puts '-----------------------------------------------------'
    # puts params
    @move = Move.find(params[:id])
    @game = @move.player.game
    @move.player.update({challenging: 'false'})
    @players = Player.where(game: @game)
    challenge = @players.where(challenging: 'pending')
    # @move.update({ provisional: false })
    if challenge.empty?
      # raise
      @move.update({ provisional: false })
      new_array = @game.remaining_letters.split(',')
      new_remaining = @game.remaining_letters
      move_letters = Letter.where(move_id: @move.id)
      move_letters.each do |ltr|
      delete_string = ltr.character + ','
      # ind = new_remaining.index(ltr.character)
      # if new_remaining.index(ltr.character) < new_remaining.length - 1  # not last character in string
      #   delete_string = ltr.character + ','
      # else  #  last character in string
      #   delete_string = ltr.character
      # end
      new_remaining = new_remaining.sub(delete_string, '')
    end

    new_current = @game.current_player + 1
    new_current = 0 if new_current > @players.length - 1

    @game.update({ remaining_letters: new_remaining, current_player: new_current })
        @players.each do |player|
        player.update({challenging: 'pending'})
      end
     GameChannel.broadcast_to(
      @game,
      # flash[:game_update] = "next player: #{nextP}, last player: #{@game.current_player}"
      render_to_string(partial: "acceptance", locals: {msg: "word was accepted", player: @move.player.user.username, score: @move.added_score, gameid:@game.id})
      # render_to_string(partial: "submission", locals: {msg: ' ffdgdd g ddfghdfhrtgg  ' , player: 'mitzi', score: 12 })
    )
    end
  end


  def destroy
    if Move.find(params[:id]).exists? == true
      @move = Move.find(params[:id])
      @move.destroy
    end
  end
end


private


  def move_params
    params.require(:move).permit(:player_id, :id, :move, :letters, :summary, :added_score, :my_score, :added_score, :operation)
  end

