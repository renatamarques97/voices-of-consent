FactoryBot.define do
  factory :abuse_type do
    sequence(:name) { |n| "Abuse Type #{n}" }
  end
end
