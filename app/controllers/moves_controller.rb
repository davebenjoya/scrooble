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
      letter_string += 'J' if ltr.joker == true
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
    @move.joker_array = params['move']['joker_array']
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
      new_remaining = new_remaining.sub(delete_string, '')
    end

    new_current = @game.current_player + 1
    new_current = 0 if new_current > @players.length - 1

    @game.update({ remaining_letters: new_remaining, current_player: new_current })
        @players.each do |player|
        player.update({challenging: 'pending'})
      end

    if params["type"] == "realwords"
      GameChannel.broadcast_to(
      @game,
      render_to_string(partial: 'real_words', locals: { msg: 'Dictionary says yes!', challenged: @move.player.user.username, challenging:current_user.username, score: @move.added_score, gameid:@game.id})
      )
    else
      GameChannel.broadcast_to(
        @game,
        render_to_string(partial: 'acceptance', locals: { msg: 'word was accepted', player: @move.player.user.username, score: @move.added_score, gameid:@game.id})
      )
    end
    end
  end


  def destroy
    if Move.find(params[:id])
      @move = Move.find(params[:id])
      @game = @move.player.game
      @players = Player.where(game: @game)
      new_current = @game.current_player + 1
      new_current = 0 if new_current > @players.length - 1
      @game.update({ current_player: new_current })
        @players.each do |player|
        player.update({challenging: 'pending'})
      end
        GameChannel.broadcast_to(
          @game,
          render_to_string(partial: "fake_words", locals: {msg: "#{params[:msg]}", gameid: @game.id})
        )
      @move.destroy
    end
  end
end


private


  def move_params
    params.require(:move).permit(:player_id, :id, :move, :letters, :summary, :added_score, :my_score, :added_score, :operation, :challenging, joker_array: [], position_array: [])
  end

