class PlayersController < ApplicationController

  def create
    @player = Player.new(player_params)
  end

  def update
    if params["completed"] == true
puts "?*?*?*?*?*?* PARAMS [completed] #{params["completed"]}    *?*?*?*?*?*?*?*?*?*?*?*"

      player.update!({ completed: true })

    end


     puts "?*?*?*?*?*?* PARAMS [CHALLENGING]     *?*?*?*?*?*?*?*?*?*?*?*"
    @player = Player.find(params[:id])
    players = Player.where(game_id: @player.game_id)
    @game = @player.game
    puts @player.user.username
    challenging_player = @player.user.username
    challenged_player = players[@game.current_player].user.username


    # switch statement

    case params['challenging']
    when 'realwords'
      if @player.challenging == true
        @player.skip += 1
      end
       GameChannel.broadcast_to(
          @game,
          render_to_string(partial: "real_words",
            locals: {
              challenged: challenged_player,
              challenging: challenging_player,
              message: 'Dictionary confirms the move!',
              words: words_string})
          )
      players.each do |player|
        player.update!({ challenging: 'pending' })
      end
      # challenge -= 1
    when 'false'
      @player.update({ challenging: 'false' })

      challenge = players.length - 1 # every player (except current player) has a chance to challenge
      players.each do |player|
        if player != @player
          challenge -= 1
        end
      end
        # raise
    when 'true'        # challenge == 'true'
      game_moves = []
      @player.update({challenging: 'true'})
      players.each do |player|
        game_move = Move.where(player: player).last
        game_moves << game_move
      end
      puts "?*?*?*?*?*?*? game_moves.length     *?*?*?*?*?*?*?*?*?*?*?*"
      puts game_moves.length
      last_move = game_moves[0]
      puts "________/////        last_move   ////////___________///////////______"
      puts last_move
      move_words = Word.where(move: last_move)
      words_string = ""
      move_words.each_with_index do |wd, index|
        words_string += wd.characters
        words_string += "," if index != move_words.length - 1
        GameChannel.broadcast_to(
          @game,
          render_to_string(partial: "challenge",
            locals: {
              challenged: challenged_player,
              challenging: challenging_player,
              words: words_string})
          )
      end
    when 'pending'
        @player.update({player_letters: params['player_letters']})
        num = params['num']
        puts "/////////////////   params['nummmmmmmm']     /////////////////"
        puts params['num']
         GameChannel.broadcast_to(
        @game,
        render_to_string(partial: 'exchange',
          locals: {
            player: challenging_player,
            numLetters: num
          })
        )
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
