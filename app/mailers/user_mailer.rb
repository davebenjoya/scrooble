class UserMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.invitation.subject
  #
  def invitation(user, sender, game)
    @greeting = "Hello there"

    # mail to: "to@example.org"
    @sender = sender
    @user = user # Instance variable => available in view
    @url = "scroobleapp.herokuapp.com/games/#{game.id}/edit"
    @others = []
    game.opponents.split(",").each do |opponent|
      if opponent != @user[0].username
        @others << opponent
      end
    end
    # raise
    mail(to: @user[0].email, subject: "#{sender.username} has challenged you to a duel of wits!")
  end
end
