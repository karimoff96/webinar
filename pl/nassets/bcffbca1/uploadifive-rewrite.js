(function () {
  var oUploadifive = jQuery.fn.uploadifive;

  if (window.file_upload_blocking) {
    $.fn.uploadifive = function () {
      if ($(this).parents(".gc-comment-form").length > 0) {
        return oUploadifive.apply(this, arguments);
      }

      if (Number(window.storage_usage_percent) > 0) {
        $(this).replaceWith(
          $(
            '<div style="color: red">' +
              Yii.t("common", "Хранилище заполнено на {percent}%", {
                percent: window.storage_usage_percent,
              }) +
              "<br/>" +
              Yii.t("common", "Чтобы загружать файлы нужно") +
              " " +
              '<a target="_blank" style="font-weight: bold; color: red;text-decoration: underline" href="/saas/account/show?files=1">' +
              Yii.t("common", "увеличить объем хранилища") +
              "</a>" +
              "</div>"
          )
        );
      } else {
        $(this).replaceWith(
          $(
            "<div class='margin-top-10 text-muted'>" +
              Yii.t(
                "common",
                "Загрузка файлов невозможна — закончилось место в файловом хранилище"
              ) +
              "</div>"
          )
        );
      }
    };
  } else {
    if (window.storage_usage_percent > 75) {
      $.fn.uploadifive = function () {
        if ($(this).parents(".gc-comment-form").length > 0) {
          return oUploadifive.apply(this, arguments);
        }

        $(
          '<div style="color: orangered">' +
            Yii.t("common", "Хранилище заполнено на {percent}%", {
              percent: window.storage_usage_percent,
            }) +
            "<br/>" +
            Yii.t("common", "Рекомендуем") +
            " " +
            '<a target="_blank" style="color: orangered;text-decoration: underline" href="/saas/account/show?files=1">' +
            Yii.t("common", "увеличить объем хранилища") +
            "</a>" +
            "</div>"
        ).appendTo($(this).parent());
        oUploadifive.apply(this, arguments);
      };
    }
  }
})();
