class UserMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.invitation.subject
  #
  def invitation(user, sender, game, adverb)
    file = File.read("public/random.json")
    adverbs = JSON.parse(file).values[0].split(",")
    greetings = JSON.parse(file).values[1].split(",")

    ran = rand(greetings.length)
    @greeting = greetings[ran].strip()


    ran = rand(adverbs.length)
    @adverb = adverbs[ran].strip.capitalize()
    # raise
    @sender = sender
    @user = user
    @url = "/games/#{game.id}/edit"
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
