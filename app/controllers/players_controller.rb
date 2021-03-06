class PlayersController < ApplicationController

  def create
    @player = Player.new(player_params)
  end


  def update
     puts "?*?*?*?*?*?* PARAMS [CHALLENGING]     *?*?*?*?*?*?*?*?*?*?*?*"
    puts player_params["challenging"]
    @player = Player.find(params[:id])
    players = Player.where(game_id: @player.game_id)
    @game = @player.game
    challenging_player = @player.user.username
    challenged_player = players[@game.current_player].user.username
    if params["challenging"] == 'false'    # string not boolean (value can be 'pending')
      @player.update({challenging: 'false'})

      challenge = players.length - 1 # every player (except current player) has a chance to challenge
      players.each do |player|
        if player != @player
          challenge -= 1
        end
      end
    elsif params["challenging"] == 'true'                                     # challenge == 'true'
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
            msg: "#{challenging_player} challenged #{challenged_player}",
            words: words_string})
        )
      end
      elsif params['challenging'] == 'pending'

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
     if challenge == 0
      # return true
     end

      # players.each do |player|
      #   player.update!({challenging: 'pending'})
      # end
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
